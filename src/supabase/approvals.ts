import { v4 as uuidv4 } from 'uuid';
import { Approval, ApprovalStatus } from '../types/models';
import { memoryStore } from './store';

export async function createApproval(params: {
  runId: string;
  kind: string;
  command: string;
  cwdHash: string;
  note?: string;
}): Promise<Approval> {
  const nowIso = new Date().toISOString();
  const approval: Approval = {
    id: uuidv4(),
    runId: params.runId,
    status: 'PENDING',
    kind: params.kind,
    command: params.command,
    cwdHash: params.cwdHash,
    note: params.note,
    requestedAt: nowIso,
  };

  memoryStore.approvals.set(approval.id, approval);
  return approval;
}

export async function getApproval(approvalId: string): Promise<Approval | null> {
  return memoryStore.approvals.get(approvalId) ?? null;
}

export async function updateApproval(
  approvalId: string,
  updates: Partial<Omit<Approval, 'id' | 'runId'>>,
): Promise<Approval | null> {
  const existing = memoryStore.approvals.get(approvalId);
  if (!existing) {
    return null;
  }

  const updated: Approval = {
    ...existing,
    ...updates,
  };

  memoryStore.approvals.set(approvalId, updated);
  return updated;
}

export function isTerminalStatus(status: ApprovalStatus): boolean {
  return status === 'APPROVED' || status === 'DENIED' || status === 'EXPIRED';
}
