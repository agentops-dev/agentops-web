import { Run, RunStatus } from '../types/models';
import { memoryStore } from './store';

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

export async function getRun(runId: string): Promise<Run | null> {
  return memoryStore.runs.get(runId) ?? null;
}

export async function upsertRunFromEvent(input: {
  runId: string;
  workspaceId: string;
  provider: string;
  eventType: string;
  eventTs: string;
  payload: Record<string, unknown>;
}): Promise<Run> {
  const existing = memoryStore.runs.get(input.runId);
  const { status, started, ended } = deriveRunStatus(input.eventType);

  const lastMessage =
    typeof input.payload?.message === 'string'
      ? (input.payload.message as string)
      : typeof input.payload?.note === 'string'
        ? (input.payload.note as string)
        : typeof input.payload?.error === 'string'
          ? (input.payload.error as string)
          : existing?.lastMessage;

  const updated: Run = {
    id: input.runId,
    provider: input.provider,
    providerRunId: existing?.providerRunId,
    workspaceId: input.workspaceId,
    status: status !== 'UNKNOWN' ? status : existing?.status ?? 'UNKNOWN',
    startedAt: started ? input.eventTs : existing?.startedAt,
    endedAt: ended ? input.eventTs : existing?.endedAt,
    lastEventAt: input.eventTs,
    lastMessage,
    meta: existing?.meta,
  };

  memoryStore.runs.set(updated.id, updated);

  return updated;
}
