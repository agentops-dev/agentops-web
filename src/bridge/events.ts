import { createEvent } from '../supabase/events';
import { upsertRunFromEvent } from '../supabase/runs';

export async function handleBridgeEvent(input: {
  workspaceId: string;
  runId: string;
  provider: string;
  eventType: string;
  eventTs: string;
  payload: Record<string, unknown>;
}): Promise<void> {
  await upsertRunFromEvent({
    runId: input.runId,
    workspaceId: input.workspaceId,
    provider: input.provider,
    eventType: input.eventType,
    eventTs: input.eventTs,
    payload: input.payload,
  });

  await createEvent({
    runId: input.runId,
    type: input.eventType,
    createdAt: input.eventTs,
    payload: input.payload,
  });
}
