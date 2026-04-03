import {
  Agent,
  Approval,
  Device,
  Event,
  Folder,
  PairTokenRecord,
  Project,
  Run,
  Workspace,
} from '../types/models';
import { loadCollection, persistDelete, persistUpsert } from '../local-db';

/** Map that writes through to SQLite (when enabled) so org/agents/runs survive restarts. */
class PersistingMap<K extends string, V extends object> extends Map<K, V> {
  constructor(private readonly collection: string) {
    super();
    for (const [id, value] of loadCollection(collection)) {
      super.set(id as K, value as V);
    }
  }

  override set(key: K, value: V): this {
    super.set(key, value);
    persistUpsert(this.collection, key, value);
    return this;
  }

  override delete(key: K): boolean {
    const existed = super.delete(key);
    if (existed) {
      persistDelete(this.collection, key);
    }
    return existed;
  }

  override clear(): void {
    for (const key of this.keys()) {
      persistDelete(this.collection, key);
    }
    super.clear();
  }
}

export const memoryStore = {
  pairTokens: new PersistingMap<string, PairTokenRecord>('pairTokens'),
  devices: new PersistingMap<string, Device>('devices'),
  workspaces: new PersistingMap<string, Workspace>('workspaces'),
  projects: new PersistingMap<string, Project>('projects'),
  folders: new PersistingMap<string, Folder>('folders'),
  agents: new PersistingMap<string, Agent>('agents'),
  runs: new PersistingMap<string, Run>('runs'),
  events: new PersistingMap<string, Event>('events'),
  approvals: new PersistingMap<string, Approval>('approvals'),
};

export const PAIR_TOKEN_TTL_MS = 10 * 60 * 1000;

export function pruneExpiredPairTokens(nowMs: number): void {
  for (const [token, record] of memoryStore.pairTokens.entries()) {
    if (record.expiresAt <= nowMs) {
      memoryStore.pairTokens.delete(token);
    }
  }
}
