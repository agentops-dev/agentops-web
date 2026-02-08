import { v4 as uuidv4 } from 'uuid';
import { Event } from '../types/models';
import { memoryStore } from './store';

export async function createEvent(params: {
  runId: string;
  type: string;
  createdAt: string;
  payload: Record<string, unknown>;
}): Promise<Event> {
  const event: Event = {
    id: uuidv4(),
    runId: params.runId,
    type: params.type,
    createdAt: params.createdAt,
    payload: params.payload,
  };

  memoryStore.events.set(event.id, event);
  return event;
}
