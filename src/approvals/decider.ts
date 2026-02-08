import { notifyApprovalUpdated } from './waiter';
import { getApproval, updateApproval } from '../supabase/approvals';
import { ApprovalStatus } from '../types/models';

export async function decideApproval(params: {
  approvalId: string;
  decision: 'APPROVE' | 'DENY';
  note?: string;
  decidedByDeviceId?: string;
}): Promise<{
  status: ApprovalStatus;
  note?: string;
} | null> {
  const approval = await getApproval(params.approvalId);
  if (!approval) {
    return null;
  }

  if (approval.status !== 'PENDING') {
    return {
      status: approval.status,
      note: approval.note,
    };
  }

  const nextStatus = params.decision === 'APPROVE' ? 'APPROVED' : 'DENIED';
  const updated = await updateApproval(params.approvalId, {
    status: nextStatus,
    note: params.note ?? approval.note,
    decidedAt: new Date().toISOString(),
    decidedByDeviceId: params.decidedByDeviceId,
  });

  if (!updated) {
    return null;
  }

  notifyApprovalUpdated(updated);

  return {
    status: updated.status,
    note: updated.note,
  };
}
