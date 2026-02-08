import { Run, RunStatus } from '../types/models';
import { requireSupabaseClient } from './client';

function normalizeEventType(eventType: string): string {
  return eventType.trim().toUpperCase();
}

function deriveRunStatus(eventType: string): {
  status: RunStatus;
  started: boolean;
  ended: boolean;
} {
  const normalized = normalizeEventType(eventType);

  if (normalized.includes('START')) {
    return { status: 'RUNNING', started: true, ended: false };
  }

  if (normalized.includes('FAIL')) {
    return { status: 'FAILED', started: false, ended: true };
  }

  if (normalized.includes('STOP') || normalized.includes('CANCEL')) {
    return { status: 'STOPPED', started: false, ended: true };
  }

  if (normalized.includes('FINISH') || normalized.includes('COMPLETE') || normalized.includes('END')) {
    return { status: 'FINISHED', started: false, ended: true };
  }

  return { status: 'UNKNOWN', started: false, ended: false };
}

function mapRunRow(row: {
  id: string;
  provider: string;
  provider_run_id: string | null;
  workspace_id: string | null;
  status: string | null;
  started_at: string | null;
  ended_at: string | null;
  last_event_at: string | null;
  last_message: string | null;
  meta: Record<string, unknown> | null;
}): Run {
  return {
    id: row.id,
    provider: row.provider,
    providerRunId: row.provider_run_id ?? undefined,
    workspaceId: row.workspace_id ?? null,
    status: (row.status ?? 'UNKNOWN') as RunStatus,
    startedAt: row.started_at ?? undefined,
    endedAt: row.ended_at ?? undefined,
    lastEventAt: row.last_event_at ?? undefined,
    lastMessage: row.last_message ?? undefined,
    meta: row.meta ?? undefined,
  };
}

export async function getRun(runId: string): Promise<Run | null> {
  const client = requireSupabaseClient();
  const { data, error } = await client
    .from('runs')
    .select('*')
    .eq('id', runId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch run: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  return mapRunRow(data);
}

export async function ensureRunExists(params: {
  runId: string;
  workspaceId: string | null;
  provider: string;
}): Promise<Run> {
  const existing = await getRun(params.runId);
  if (existing) {
    return existing;
  }

  const client = requireSupabaseClient();
  const { data, error } = await client
    .from('runs')
    .insert({
      id: params.runId,
      provider: params.provider,
      workspace_id: params.workspaceId ?? null,
      status: 'UNKNOWN',
    })
    .select('*')
    .single();

  if (error || !data) {
    throw new Error(`Failed to create run: ${error?.message ?? 'unknown error'}`);
  }

  return mapRunRow(data);
}

export async function upsertRunFromEvent(input: {
  runId: string;
  workspaceId: string;
  provider: string;
  eventType: string;
  eventTs: string;
  payload: Record<string, unknown>;
}): Promise<Run> {
  const client = requireSupabaseClient();
  const existing = await getRun(input.runId);
  const { status, started, ended } = deriveRunStatus(input.eventType);

  const lastMessage =
    typeof input.payload?.message === 'string'
      ? (input.payload.message as string)
      : typeof input.payload?.note === 'string'
        ? (input.payload.note as string)
        : typeof input.payload?.error === 'string'
          ? (input.payload.error as string)
          : existing?.lastMessage;

  const payload = {
    id: input.runId,
    provider: input.provider,
    provider_run_id: existing?.providerRunId,
    workspace_id: input.workspaceId,
    status: status !== 'UNKNOWN' ? status : existing?.status ?? 'UNKNOWN',
    started_at: started ? input.eventTs : existing?.startedAt,
    ended_at: ended ? input.eventTs : existing?.endedAt,
    last_event_at: input.eventTs,
    last_message: lastMessage,
    meta: existing?.meta,
  };

  const { data, error } = await client
    .from('runs')
    .upsert(payload, { onConflict: 'id' })
    .select('*')
    .single();

  if (error || !data) {
    throw new Error(`Failed to upsert run: ${error?.message ?? 'unknown error'}`);
  }

  return mapRunRow(data);
}
