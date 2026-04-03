import { createEvent } from '../supabase/events';
import { upsertAgentHeartbeat } from '../supabase/agents';
import { upsertRunFromEvent } from '../supabase/runs';

export async function handleBridgeEvent(input: {
  workspaceId: string;
  runId: string;
  provider: string;
  eventType: string;
  eventTs: string;
  payload: Record<string, unknown>;
}): Promise<void> {
  // Event-based agent identity mirrors session-center style detection:
  // derive an agent from provider + run signals when no OS process scan is available.
  await upsertAgentHeartbeat({
    provider: input.provider,
    status: 'RUNNING',
    heartbeatAt: input.eventTs,
    externalAgentId: input.runId,
    displayName: `${input.provider} run ${input.runId.slice(0, 8)}`,
    workspaceId: input.workspaceId,
    runId: input.runId,
    meta: {
      source: 'bridge-event',
      eventType: input.eventType,
    },
  });

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
