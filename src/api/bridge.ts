import crypto from 'crypto';
import { Router } from 'express';
import { z } from 'zod';
import { handleBridgeEvent } from '../bridge/events';
import { verifyBridgeRequest } from '../bridge/validator';
import { waitForApprovalDecision } from '../approvals/waiter';
import { createApproval, getApproval } from '../supabase/approvals';
import { getRun } from '../supabase/runs';
import { getDeviceById, getWorkspaceById } from '../supabase/workspaces';
import { sendPushNotification } from '../push';

const router = Router();

const eventSchema = z.object({
  workspace_id: z.string().min(1),
  run_id: z.string().min(1),
  provider: z.string().min(1),
  event_type: z.string().min(1),
  event_ts: z.string().min(1),
  payload: z.record(z.unknown()).default({}),
});

const approvalRequestSchema = z.object({
  run_id: z.string().min(1),
  command: z.string().min(1),
  cwd: z.string().min(1),
  context: z.record(z.unknown()).optional().default({}),
  workspace_id: z.string().min(1).optional(),
});

function isValidIsoDate(value: string): boolean {
  return Number.isFinite(Date.parse(value));
}

function extractWorkspaceIdFromContext(
  context?: Record<string, unknown>,
): string | null {
  if (!context) {
    return null;
  }

  const candidate =
    typeof context.workspace_id === 'string'
      ? context.workspace_id
      : typeof context.workspaceId === 'string'
        ? context.workspaceId
        : null;

  return candidate && candidate.length > 0 ? candidate : null;
}

router.post('/event', async (req, res) => {
  const parsed = eventSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: 'Invalid request body',
      details: parsed.error.flatten(),
    });
  }

  if (!isValidIsoDate(parsed.data.event_ts)) {
    return res.status(400).json({ error: 'Invalid event_ts timestamp' });
  }

  const auth = await verifyBridgeRequest({
    headers: req.headers,
    body: req.body,
    workspaceId: parsed.data.workspace_id,
  });

  if (!auth.ok) {
    return res.status(401).json({ error: auth.error });
  }

  await handleBridgeEvent({
    workspaceId: parsed.data.workspace_id,
    runId: parsed.data.run_id,
    provider: parsed.data.provider,
    eventType: parsed.data.event_type,
    eventTs: parsed.data.event_ts,
    payload: parsed.data.payload,
  });

  return res.json({ status: 'ok' });
});

router.post('/approval/request', async (req, res) => {
  const parsed = approvalRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: 'Invalid request body',
      details: parsed.error.flatten(),
    });
  }

  const contextWorkspaceId = extractWorkspaceIdFromContext(parsed.data.context);
  const run = await getRun(parsed.data.run_id);
  const workspaceId =
    parsed.data.workspace_id ?? contextWorkspaceId ?? run?.workspaceId ?? null;

  const auth = await verifyBridgeRequest({
    headers: req.headers,
    body: req.body,
    workspaceId,
  });

  if (!auth.ok) {
    return res.status(401).json({ error: auth.error });
  }

  const cwdHash = crypto
    .createHash('sha256')
    .update(parsed.data.cwd)
    .digest('hex');

  const approval = await createApproval({
    runId: parsed.data.run_id,
    kind: 'COMMAND',
    command: parsed.data.command,
    cwdHash,
  });

  if (workspaceId) {
    const workspace = await getWorkspaceById(workspaceId);
    if (workspace) {
      const device = await getDeviceById(workspace.deviceId);
      if (device) {
        await sendPushNotification(device, {
          title: 'Approval Requested',
          body: parsed.data.command,
          data: {
            approval_id: approval.id,
            run_id: parsed.data.run_id,
          },
        });
      }
    }
  }

  return res.json({ approval_id: approval.id });
});

router.get('/approval/:approvalId/wait', async (req, res) => {
  const approvalId = req.params.approvalId;
  const approval = await getApproval(approvalId);
  if (!approval) {
    return res.status(404).json({ error: 'Approval not found' });
  }

  const run = await getRun(approval.runId);
  const auth = await verifyBridgeRequest({
    headers: req.headers,
    body: {},
    workspaceId: run?.workspaceId ?? null,
  });

  if (!auth.ok) {
    return res.status(401).json({ error: auth.error });
  }

  if (approval.status !== 'PENDING') {
    return res.json({ status: approval.status, note: approval.note ?? null });
  }

  const timeoutRaw = req.query.timeout;
  const timeoutSec =
    typeof timeoutRaw === 'string' ? Number.parseInt(timeoutRaw, 10) : 90;
  const safeTimeoutSec =
    Number.isFinite(timeoutSec) && timeoutSec > 0 ? timeoutSec : 90;

  const result = await waitForApprovalDecision(
    approvalId,
    safeTimeoutSec * 1000,
  );

  if (!result) {
    return res.json({ status: 'PENDING' });
  }

  return res.json({ status: result.status, note: result.note ?? null });
});

export default router;
