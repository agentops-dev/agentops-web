import { v4 as uuidv4 } from 'uuid';
import { Agent, AgentStatus, Event, Folder, Project, Run } from '../types/models';
import { getFolderAncestry, getFolderById, getProjectById } from './org';
import { listEventsByRunIds } from './events';
import { getRunsByAgentId, linkRunToAgent } from './runs';
import { memoryStore } from './store';

function normalizeAgentStatus(status: string): AgentStatus {
  const normalized = status.trim().toUpperCase();
  if (
    normalized === 'RUNNING' ||
    normalized === 'IDLE' ||
    normalized === 'FAILED' ||
    normalized === 'OFFLINE'
  ) {
    return normalized;
  }
  return 'UNKNOWN';
}

function agentIdentityKey(provider: string, externalAgentId?: string): string | null {
  if (!externalAgentId) {
    return null;
  }
  return `${provider.trim().toLowerCase()}::${externalAgentId.trim()}`;
}

function findAgentByIdentity(provider: string, externalAgentId?: string): Agent | null {
  const key = agentIdentityKey(provider, externalAgentId);
  if (!key) {
    return null;
  }

  for (const agent of memoryStore.agents.values()) {
    const agentKey = agentIdentityKey(agent.provider, agent.externalAgentId);
    if (agentKey === key) {
      return agent;
    }
  }
  return null;
}

export async function upsertAgentHeartbeat(params: {
  provider: string;
  status: string;
  heartbeatAt: string;
  externalAgentId?: string;
  displayName?: string;
  workspaceId?: string;
  runId?: string;
  projectId?: string;
  folderId?: string;
  meta?: Record<string, unknown>;
}): Promise<Agent> {
  const nowIso = new Date().toISOString();
  const existing = findAgentByIdentity(params.provider, params.externalAgentId);
  const heartbeatAt = params.heartbeatAt;

  if (existing) {
    const updated: Agent = {
      ...existing,
      status: normalizeAgentStatus(params.status),
      displayName: params.displayName ?? existing.displayName,
      workspaceId: params.workspaceId ?? existing.workspaceId,
      projectId: params.projectId ?? existing.projectId,
      folderId: params.folderId ?? existing.folderId,
      lastSeenAt: heartbeatAt,
      updatedAt: nowIso,
      meta: params.meta ?? existing.meta,
    };
    memoryStore.agents.set(updated.id, updated);
    if (params.runId) {
      await linkRunToAgent(params.runId, updated.id);
    }
    return updated;
  }

  const created: Agent = {
    id: uuidv4(),
    provider: params.provider,
    externalAgentId: params.externalAgentId,
    displayName: params.displayName,
    workspaceId: params.workspaceId,
    projectId: params.projectId,
    folderId: params.folderId,
    status: normalizeAgentStatus(params.status),
    lastSeenAt: heartbeatAt,
    createdAt: nowIso,
    updatedAt: nowIso,
    meta: params.meta,
  };
  memoryStore.agents.set(created.id, created);
  if (params.runId) {
    await linkRunToAgent(params.runId, created.id);
  }
  return created;
}

export async function listAgents(): Promise<Agent[]> {
  return Array.from(memoryStore.agents.values()).sort((a, b) =>
    b.lastSeenAt.localeCompare(a.lastSeenAt),
  );
}

export async function removeAgentsByMetaSource(source: string): Promise<number> {
  let removed = 0;
  for (const [agentId, agent] of memoryStore.agents.entries()) {
    const agentSource =
      agent.meta && typeof agent.meta.source === 'string'
        ? (agent.meta.source as string)
        : null;
    if (agentSource === source) {
      memoryStore.agents.delete(agentId);
      removed += 1;
    }
  }
  return removed;
}

export async function getAgentById(agentId: string): Promise<Agent | null> {
  return memoryStore.agents.get(agentId) ?? null;
}

export async function moveAgentToFolder(params: {
  agentId: string;
  projectId: string;
  folderId: string;
}): Promise<Agent> {
  const agent = await getAgentById(params.agentId);
  if (!agent) {
    throw new Error('Agent not found');
  }

  const project = await getProjectById(params.projectId);
  if (!project) {
    throw new Error('Project not found');
  }

  const folder = await getFolderById(params.folderId);
  if (!folder) {
    throw new Error('Folder not found');
  }

  if (folder.projectId !== project.id) {
    throw new Error('Folder does not belong to project');
  }

  const updated: Agent = {
    ...agent,
    projectId: project.id,
    folderId: folder.id,
    updatedAt: new Date().toISOString(),
  };
  memoryStore.agents.set(updated.id, updated);
  return updated;
}

export async function getAgentDashboardLogs(agentId: string): Promise<{
  agent: Agent;
  runs: Run[];
  events: Event[];
}> {
  const agent = await getAgentById(agentId);
  if (!agent) {
    throw new Error('Agent not found');
  }

  const runs = await getRunsByAgentId(agentId);
  const runIds = runs.map((run) => run.id);
  const events = await listEventsByRunIds(runIds);
  return { agent, runs, events };
}

export async function getEffectiveAgentContext(agentId: string): Promise<{
  agent: Agent;
  project: Project | null;
  ancestry: Folder[];
  effectiveRules: string[];
}> {
  const agent = await getAgentById(agentId);
  if (!agent) {
    throw new Error('Agent not found');
  }

  const project = agent.projectId ? await getProjectById(agent.projectId) : null;
  const ancestry = agent.folderId ? await getFolderAncestry(agent.folderId) : [];

  const effectiveRules: string[] = [];
  if (project) {
    effectiveRules.push(`Project: ${project.name}`);
  }
  for (const folder of ancestry) {
    effectiveRules.push(`Folder: ${folder.name}`);
    if (folder.charter) {
      effectiveRules.push(`Charter(${folder.name}): ${folder.charter}`);
    }
  }
  if (agent.meta && Object.keys(agent.meta).length > 0) {
    effectiveRules.push(`Agent metadata keys: ${Object.keys(agent.meta).join(', ')}`);
  }

  return { agent, project, ancestry, effectiveRules };
}
