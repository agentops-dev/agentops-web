import { exec } from 'child_process';
import { removeAgentsByMetaSource, upsertAgentHeartbeat } from '../supabase/agents';

type Candidate = {
  provider: string;
  displayName: string;
  pid: string;
  command: string;
};

type LogicalAgent = {
  provider: string;
  externalAgentId: string;
  displayName: string;
  command: string;
};

function detectProvider(command: string): { provider: string; displayName: string } | null {
  const normalized = command.toLowerCase();
  const has = (needle: string): boolean => normalized.includes(needle);
  const hasWord = (word: string): boolean =>
    new RegExp(`(^|[^a-z0-9])${word}([^a-z0-9]|$)`, 'i').test(normalized);

  if (has('claude') || hasWord('sonnet') || hasWord('opus') || hasWord('haiku')) {
    return { provider: 'claude', displayName: 'Claude' };
  }
  if (
    has('codex') ||
    has('openai/codex') ||
    has('chatgpt-codex') ||
    hasWord('gpt-5') ||
    hasWord('o3') ||
    hasWord('o4')
  ) {
    return { provider: 'codex', displayName: 'Codex' };
  }

  // Cursor Agent can appear under different process names depending on runtime.
  const isCursorAgentLike =
    has('cursor-agent') ||
    has('cursor agent') ||
    has('/cursor/agent') ||
    has('.cursor') ||
    has('cursor helper') ||
    has('/cursor.app/') ||
    has('cursor-cli') ||
    has('cursor code') ||
    (has('cursor') && has('agent'));

  if (isCursorAgentLike) {
    return { provider: 'cursor', displayName: 'Cursor Agent' };
  }

  if (has('cursor')) {
    return { provider: 'cursor', displayName: 'Cursor' };
  }
  return null;
}

function parsePsOutput(stdout: string): Candidate[] {
  const lines = stdout.split('\n').map((line) => line.trim()).filter(Boolean);
  const found: Candidate[] = [];
  const seen = new Set<string>();

  for (const line of lines) {
    const match = line.match(/^(\d+)\s+(.*)$/);
    if (!match) {
      continue;
    }
    const pid = match[1];
    const command = match[2];
    const detected = detectProvider(command);
    if (!detected) {
      continue;
    }
    if (seen.has(pid)) {
      continue;
    }
    seen.add(pid);

    found.push({
      provider: detected.provider,
      displayName: detected.displayName,
      pid,
      command,
    });
  }

  return found;
}

function isNoiseProcess(command: string): boolean {
  const normalized = command.toLowerCase();
  const noiseFragments = [
    'crashpad',
    'cursor helper (gpu)',
    'cursor helper (renderer)',
    'cursor helper: filewatcher',
    'cursor helper: shared-process',
    'extension-host',
    'plugin',
    'typingsinstaller',
    'tsserver',
    'shipit',
    'gk mcp',
    'textinputuimachelper',
  ];
  return noiseFragments.some((fragment) => normalized.includes(fragment));
}

function isStrongCursorAgent(command: string): boolean {
  const normalized = command.toLowerCase();
  return (
    normalized.includes('agent-exec') ||
    normalized.includes('cursor_cli_mode=local') ||
    normalized.includes('/resources/app/out/cli.js') ||
    normalized === 'cursor' ||
    normalized.includes('/cursor.app/contents/macos/cursor')
  );
}

function isLikelyCodexAgent(command: string): boolean {
  const normalized = command.toLowerCase();
  if (normalized.includes('mcp')) {
    return false;
  }
  return (
    normalized === 'codex' ||
    normalized.includes('openai/codex') ||
    normalized.includes('chatgpt-codex') ||
    normalized.includes(' codex ')
  );
}

function sanitizeCommand(command: string): string {
  // Redact high-risk env assignment values to avoid storing secrets.
  return command
    .replace(/\b([A-Z0-9_]*(?:KEY|TOKEN|SECRET|PASSWORD|PASS|AUTH)[A-Z0-9_]*)=("[^"]*"|'[^']*'|[^\s]+)/g, '$1=[REDACTED]')
    .replace(/\s+/g, ' ')
    .trim();
}

function pickBestCandidate(candidates: Candidate[], provider: string): Candidate | null {
  const providerCandidates = candidates.filter((candidate) => candidate.provider === provider);
  if (providerCandidates.length === 0) {
    return null;
  }

  if (provider === 'cursor') {
    const preferred = providerCandidates.filter((candidate) =>
      isStrongCursorAgent(candidate.command) && !isNoiseProcess(candidate.command),
    );
    if (preferred.length > 0) {
      return preferred[0];
    }
    const fallback = providerCandidates.filter(
      (candidate) => !isNoiseProcess(candidate.command),
    );
    return fallback[0] ?? providerCandidates[0];
  }

  if (provider === 'codex') {
    const preferred = providerCandidates.filter((candidate) =>
      isLikelyCodexAgent(candidate.command),
    );
    return preferred[0] ?? providerCandidates[0];
  }

  if (provider === 'claude') {
    const preferred = providerCandidates.find(
      (candidate) => candidate.command.trim().toLowerCase() === 'claude',
    );
    return preferred ?? providerCandidates[0];
  }

  return providerCandidates[0];
}

function buildLogicalAgents(candidates: Candidate[]): LogicalAgent[] {
  const providers: Array<'cursor' | 'claude' | 'codex'> = ['cursor', 'claude', 'codex'];
  const logicalAgents: LogicalAgent[] = [];

  for (const provider of providers) {
    const selected = pickBestCandidate(candidates, provider);
    if (!selected) {
      continue;
    }
    const displayName =
      provider === 'cursor'
        ? 'Cursor Agent'
        : provider === 'claude'
          ? 'Claude Agent'
          : 'Codex Agent';
    logicalAgents.push({
      provider,
      externalAgentId: `local-${provider}`,
      displayName,
      command: sanitizeCommand(selected.command),
    });
  }

  return logicalAgents;
}

function runCommand(command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(stdout);
    });
  });
}

async function readProcessList(): Promise<string> {
  const outputs = await Promise.allSettled([
    runCommand('ps -axo pid,args'),
    runCommand('ps -axo pid,comm'),
    runCommand('pgrep -fal "cursor|claude|codex|agent"'),
  ]);

  const chunks: string[] = [];
  for (const output of outputs) {
    if (output.status === 'fulfilled') {
      chunks.push(output.value);
    }
  }

  if (chunks.length === 0) {
    throw new Error('Could not read process list');
  }

  return chunks.join('\n');
}

export async function detectLocalAgentCandidates(): Promise<Candidate[]> {
  const stdout = await readProcessList();
  return parsePsOutput(stdout);
}

export async function detectAndUpsertLocalAgents(): Promise<{ detected: number }> {
  const candidates = await detectLocalAgentCandidates();
  const logicalAgents = buildLogicalAgents(candidates);
  const nowIso = new Date().toISOString();

  await removeAgentsByMetaSource('local-process-scan');

  for (const agent of logicalAgents) {
    await upsertAgentHeartbeat({
      provider: agent.provider,
      status: 'RUNNING',
      heartbeatAt: nowIso,
      externalAgentId: agent.externalAgentId,
      displayName: agent.displayName,
      meta: {
        source: 'local-process-scan',
        command: agent.command,
        mode: 'aggregated',
      },
    });
  }

  return { detected: logicalAgents.length };
}
