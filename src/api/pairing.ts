import { Router } from 'express';
import { z } from 'zod';
import {
  consumePairToken,
  createDeviceAndWorkspace,
  createPairToken,
} from '../supabase/workspaces';

const router = Router();

const pairStartSchema = z.object({
  machine_id: z.string().min(1),
  workspace_fingerprint: z.string().min(1),
  display_name: z.string().min(1),
});

const pairCompleteSchema = z.object({
  pair_token: z.string().min(1),
  platform: z.enum(['ios', 'android']),
  push_token: z.string().min(1),
});

router.post('/start', async (req, res) => {
  const parsed = pairStartSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: 'Invalid request body',
      details: parsed.error.flatten(),
    });
  }

  try {
    const { pairToken, expiresAt } = await createPairToken({
      machineId: parsed.data.machine_id,
      workspaceFingerprint: parsed.data.workspace_fingerprint,
      displayName: parsed.data.display_name,
    });

    return res.json({ pair_token: pairToken, expires_at: expiresAt });
  } catch (error) {
    console.error('Pairing start failed', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ error: 'Internal server error', details: message });
  }
});

router.post('/complete', async (req, res) => {
  const parsed = pairCompleteSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: 'Invalid request body',
      details: parsed.error.flatten(),
    });
  }

  try {
    const tokenRecord = await consumePairToken(parsed.data.pair_token);
    if (!tokenRecord) {
      return res.status(400).json({ error: 'Invalid or expired pair_token' });
    }

    const { device, workspace } = await createDeviceAndWorkspace({
      machineId: tokenRecord.machineId,
      workspaceFingerprint: tokenRecord.workspaceFingerprint,
      displayName: tokenRecord.displayName,
      platform: parsed.data.platform,
      pushToken: parsed.data.push_token,
    });

    return res.json({
      device_id: device.id,
      bridge_secret: workspace.bridgeSecret,
      workspace_id: workspace.id,
    });
  } catch (error) {
    console.error('Pairing completion failed', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ error: 'Internal server error', details: message });
  }
});

export default router;
