import { Event } from '../types/models';
import { requireSupabaseClient } from './client';

export async function createEvent(params: {
  runId: string;
  type: string;
  createdAt: string;
  payload: Record<string, unknown>;
}): Promise<Event> {
  const client = requireSupabaseClient();

  const { data, error } = await client
    .from('events')
    .insert({
      run_id: params.runId,
      type: params.type,
      created_at: params.createdAt,
      payload: params.payload,
    })
    .select('*')
    .single();

  if (error || !data) {
    throw new Error(`Failed to create event: ${error?.message ?? 'unknown error'}`);
  }

  return {
    id: data.id,
    runId: data.run_id,
    type: data.type,
    createdAt: data.created_at,
    payload: data.payload ?? {},
  };
}
