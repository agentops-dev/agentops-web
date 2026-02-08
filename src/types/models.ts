export type Platform = 'ios' | 'android';

export interface Device {
  id: string;
  platform: Platform;
  pushToken: string;
  createdAt: string;
  updatedAt: string;
}

export interface Workspace {
  id: string;
  deviceId: string;
  machineId: string;
  displayName: string;
  projectFingerprint: string;
  bridgeSecret: string;
  createdAt: string;
  updatedAt: string;
}

export type RunStatus = 'RUNNING' | 'FINISHED' | 'FAILED' | 'STOPPED' | 'UNKNOWN';

export interface Run {
  id: string;
  provider: string;
  providerRunId?: string;
  workspaceId: string | null;
  status: RunStatus;
  startedAt?: string;
  endedAt?: string;
  lastEventAt?: string;
  lastMessage?: string;
  meta?: Record<string, unknown>;
}

export interface Event {
  id: string;
  runId: string;
  type: string;
  createdAt: string;
  payload: Record<string, unknown>;
}

export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'DENIED' | 'EXPIRED';

export interface Approval {
  id: string;
  runId: string;
  status: ApprovalStatus;
  kind: string;
  command: string;
  cwdHash: string;
  note?: string;
  requestedAt: string;
  decidedAt?: string;
  decidedByDeviceId?: string;
}
