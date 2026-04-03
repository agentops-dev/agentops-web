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

export interface Project {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Folder {
  id: string;
  projectId: string;
  parentFolderId?: string;
  name: string;
  depth: number;
  charter?: string;
  createdAt: string;
  updatedAt: string;
}

export type AgentStatus = 'RUNNING' | 'IDLE' | 'FAILED' | 'OFFLINE' | 'UNKNOWN';

export interface Agent {
  id: string;
  provider: string;
  externalAgentId?: string;
  displayName?: string;
  workspaceId?: string;
  projectId?: string;
  folderId?: string;
  status: AgentStatus;
  lastSeenAt: string;
  createdAt: string;
  updatedAt: string;
  meta?: Record<string, unknown>;
}

export type RunStatus = 'RUNNING' | 'FINISHED' | 'FAILED' | 'STOPPED' | 'UNKNOWN';

export interface Run {
  id: string;
  agentId?: string;
  provider: string;
  providerRunId?: string;
  workspaceId: string;
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

export interface PairTokenRecord {
  token: string;
  machineId: string;
  workspaceFingerprint: string;
  displayName: string;
  expiresAt: number;
}
