import { Approval, Device, Event, PairTokenRecord, Run, Workspace } from '../types/models';

export const memoryStore = {
  pairTokens: new Map<string, PairTokenRecord>(),
  devices: new Map<string, Device>(),
  workspaces: new Map<string, Workspace>(),
  runs: new Map<string, Run>(),
  events: new Map<string, Event>(),
  approvals: new Map<string, Approval>(),
};

export const PAIR_TOKEN_TTL_MS = 10 * 60 * 1000;

export function pruneExpiredPairTokens(nowMs: number): void {
  for (const [token, record] of memoryStore.pairTokens.entries()) {
    if (record.expiresAt <= nowMs) {
      memoryStore.pairTokens.delete(token);
    }
  }
}
