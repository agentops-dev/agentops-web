import { Approval, ApprovalStatus } from '../types/models';
import { requireSupabaseClient } from './client';

export async function createApproval(params: {
  runId: string;
  kind: string;
  command: string;
  cwdHash: string;
  note?: string;
}): Promise<Approval> {
  const client = requireSupabaseClient();

  const { data, error } = await client
    .from('approvals')
    .insert({
      run_id: params.runId,
      status: 'PENDING',
      kind: params.kind,
      command: params.command,
      cwd_hash: params.cwdHash,
      note: params.note,
      requested_at: new Date().toISOString(),
    })
    .select('*')
    .single();

  if (error || !data) {
    throw new Error(`Failed to create approval: ${error?.message ?? 'unknown error'}`);
  }

  return {
    id: data.id,
    runId: data.run_id,
    status: data.status as ApprovalStatus,
    kind: data.kind,
    command: data.command,
    cwdHash: data.cwd_hash,
    note: data.note ?? undefined,
    requestedAt: data.requested_at,
    decidedAt: data.decided_at ?? undefined,
    decidedByDeviceId: data.decided_by_device_id ?? undefined,
  };
}

export async function getApproval(approvalId: string): Promise<Approval | null> {
  const client = requireSupabaseClient();
  const { data, error } = await client
    .from('approvals')
    .select('*')
    .eq('id', approvalId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch approval: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  return {
    id: data.id,
    runId: data.run_id,
    status: data.status as ApprovalStatus,
    kind: data.kind,
    command: data.command,
    cwdHash: data.cwd_hash,
    note: data.note ?? undefined,
    requestedAt: data.requested_at,
    decidedAt: data.decided_at ?? undefined,
    decidedByDeviceId: data.decided_by_device_id ?? undefined,
  };
}

export async function updateApproval(
  approvalId: string,
  updates: Partial<Omit<Approval, 'id' | 'runId'>>,
): Promise<Approval | null> {
  const client = requireSupabaseClient();

  const payload: Record<string, unknown> = {};
  if (updates.status) {
    payload.status = updates.status;
  }
  if (updates.kind) {
    payload.kind = updates.kind;
  }
  if (updates.command) {
    payload.command = updates.command;
  }
  if (updates.cwdHash) {
    payload.cwd_hash = updates.cwdHash;
  }
  if (updates.note !== undefined) {
    payload.note = updates.note;
  }
  if (updates.requestedAt) {
    payload.requested_at = updates.requestedAt;
  }
  if (updates.decidedAt) {
    payload.decided_at = updates.decidedAt;
  }
  if (updates.decidedByDeviceId !== undefined) {
    payload.decided_by_device_id = updates.decidedByDeviceId;
  }

  const { data, error } = await client
    .from('approvals')
    .update(payload)
    .eq('id', approvalId)
    .select('*');

  if (error) {
    throw new Error(`Failed to update approval: ${error.message}`);
  }

  const updated = Array.isArray(data) ? data[0] : data;
  if (!updated) {
    return null;
  }

  return {
    id: updated.id,
    runId: updated.run_id,
    status: updated.status as ApprovalStatus,
    kind: updated.kind,
    command: updated.command,
    cwdHash: updated.cwd_hash,
    note: updated.note ?? undefined,
    requestedAt: updated.requested_at,
    decidedAt: updated.decided_at ?? undefined,
    decidedByDeviceId: updated.decided_by_device_id ?? undefined,
  };
}

export function isTerminalStatus(status: ApprovalStatus): boolean {
  return status === 'APPROVED' || status === 'DENIED' || status === 'EXPIRED';
}
