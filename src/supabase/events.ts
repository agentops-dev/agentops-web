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

export async function listEventsByRunIds(runIds: string[]): Promise<Event[]> {
  if (runIds.length === 0) {
    return [];
  }

  const runIdSet = new Set(runIds);
  return Array.from(memoryStore.events.values())
    .filter((event) => runIdSet.has(event.runId))
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function listEvents(limit = 200): Promise<Event[]> {
  return Array.from(memoryStore.events.values())
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit);
}
