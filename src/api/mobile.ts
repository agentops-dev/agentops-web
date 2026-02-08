import { Router } from 'express';
import { z } from 'zod';
import { decideApproval } from '../approvals/decider';

const router = Router();

const decisionSchema = z.object({
  decision: z.enum(['APPROVE', 'DENY', 'APPROVED', 'DENIED']),
  note: z.string().optional(),
});

router.post('/approval/:approvalId/decision', async (req, res) => {
  const parsed = decisionSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: 'Invalid request body',
      details: parsed.error.flatten(),
    });
  }

  try {
    const approvalId = req.params.approvalId;
    const normalizedDecision =
      parsed.data.decision === 'APPROVED' || parsed.data.decision === 'APPROVE'
        ? 'APPROVE'
        : 'DENY';

    const deviceIdHeader = req.headers['x-device-id'];
    const decidedByDeviceId =
      typeof deviceIdHeader === 'string' ? deviceIdHeader : undefined;

    const decision = await decideApproval({
      approvalId,
      decision: normalizedDecision,
      note: parsed.data.note,
      decidedByDeviceId,
    });

    if (!decision) {
      return res.status(404).json({ error: 'Approval not found' });
    }

    return res.json({ status: decision.status, note: decision.note ?? null });
  } catch (error) {
    console.error('Mobile approval decision failed', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ error: 'Internal server error', details: message });
  }
});

export default router;
