import { Router } from 'express';
import { handleBridgeEvent } from '../bridge/events';
import { getAgentDashboardLogs, listAgents } from '../supabase/agents';
import { listEvents } from '../supabase/events';
import { listRuns } from '../supabase/runs';

const router = Router();

router.get('/agents', async (_req, res) => {
  const agents = await listAgents();
  return res.json({ agents });
});

router.get('/agents/:agentId/logs', async (req, res) => {
  try {
    const logs = await getAgentDashboardLogs(req.params.agentId);
    return res.json(logs);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch logs';
    if (message === 'Agent not found') {
      return res.status(404).json({ error: message });
    }
    return res.status(400).json({ error: message });
  }
});

router.get('/runs', async (_req, res) => {
  const runs = await listRuns();
  return res.json({ runs });
});

router.get('/events', async (req, res) => {
  const limitRaw = req.query.limit;
  const limit = typeof limitRaw === 'string' ? Number.parseInt(limitRaw, 10) : 200;
  const safeLimit = Number.isFinite(limit) && limit > 0 ? limit : 200;
  const events = await listEvents(safeLimit);
  return res.json({ events });
});

router.post('/dev/test-event', async (_req, res) => {
  const nowIso = new Date().toISOString();
  const runId = `demo-run-${Date.now()}`;
  await handleBridgeEvent({
    workspaceId: 'demo-workspace',
    runId,
    provider: 'cursor',
    eventType: 'RUN_STARTED',
    eventTs: nowIso,
    payload: { message: 'Demo run started from /app test button' },
  });

  return res.json({ status: 'ok', run_id: runId });
});

export default router;
