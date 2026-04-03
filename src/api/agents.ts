import { Router } from 'express';
import { z } from 'zod';
import { listAgents, upsertAgentHeartbeat } from '../supabase/agents';
import {
  detectAndUpsertLocalAgents,
  detectLocalAgentCandidates,
} from '../detection/local-agents';

const router = Router();

const heartbeatSchema = z.object({
  provider: z.string().min(1),
  status: z.string().min(1),
  heartbeat_at: z.string().min(1),
  external_agent_id: z.string().optional(),
  display_name: z.string().optional(),
  workspace_id: z.string().optional(),
  run_id: z.string().optional(),
  project_id: z.string().optional(),
  folder_id: z.string().optional(),
  meta: z.record(z.unknown()).optional(),
});

function isValidIsoDate(value: string): boolean {
  return Number.isFinite(Date.parse(value));
}

router.post('/heartbeat', async (req, res) => {
  const parsed = heartbeatSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: 'Invalid request body',
      details: parsed.error.flatten(),
    });
  }

  if (!isValidIsoDate(parsed.data.heartbeat_at)) {
    return res.status(400).json({ error: 'Invalid heartbeat_at timestamp' });
  }

  const agent = await upsertAgentHeartbeat({
    provider: parsed.data.provider,
    status: parsed.data.status,
    heartbeatAt: parsed.data.heartbeat_at,
    externalAgentId: parsed.data.external_agent_id,
    displayName: parsed.data.display_name,
    workspaceId: parsed.data.workspace_id,
    runId: parsed.data.run_id,
    projectId: parsed.data.project_id,
    folderId: parsed.data.folder_id,
    meta: parsed.data.meta,
  });

  return res.json({
    agent_id: agent.id,
    status: agent.status,
    last_seen_at: agent.lastSeenAt,
  });
});

router.get('/', async (_req, res) => {
  const agents = await listAgents();
  return res.json({ agents });
});

router.post('/detect', async (_req, res) => {
  try {
    const result = await detectAndUpsertLocalAgents();
    const agents = await listAgents();
    return res.json({
      detected: result.detected,
      total_agents: agents.length,
      agents,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to detect local agents';
    return res.status(500).json({ error: message });
  }
});

router.get('/detect', async (_req, res) => {
  try {
    const result = await detectAndUpsertLocalAgents();
    const agents = await listAgents();
    return res.json({
      detected: result.detected,
      total_agents: agents.length,
      agents,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to detect local agents';
    return res.status(500).json({ error: message });
  }
});

router.get('/detect/debug', async (_req, res) => {
  try {
    const candidates = await detectLocalAgentCandidates();
    return res.json({
      candidate_count: candidates.length,
      candidates: candidates.slice(0, 50),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to inspect local process list';
    return res.status(500).json({ error: message });
  }
});

export default router;
