export interface PairStartRequest {
  machine_id: string;
  workspace_fingerprint: string;
  display_name: string;
}

export interface PairStartResponse {
  pair_token: string;
  expires_at: string;
}

export interface PairCompleteRequest {
  pair_token: string;
  platform: 'ios' | 'android';
  push_token: string;
}

export interface PairCompleteResponse {
  device_id: string;
  bridge_secret: string;
  workspace_id: string;
}

export interface BridgeEventRequest {
  workspace_id: string;
  run_id: string;
  provider: string;
  event_type: string;
  event_ts: string;
  payload: Record<string, unknown>;
}

export interface ApprovalRequestPayload {
  run_id: string;
  command: string;
  cwd: string;
  context?: Record<string, unknown>;
  workspace_id?: string;
}

export type ApprovalDecisionInput = 'APPROVE' | 'DENY';

export interface AgentHeartbeatRequest {
  provider: string;
  status: string;
  heartbeat_at: string;
  external_agent_id?: string;
  display_name?: string;
  workspace_id?: string;
  run_id?: string;
  project_id?: string;
  folder_id?: string;
  meta?: Record<string, unknown>;
}

export interface CreateProjectRequest {
  name: string;
}

export interface CreateFolderRequest {
  project_id: string;
  name: string;
  parent_folder_id?: string;
  charter?: string;
}

export interface MoveAgentRequest {
  project_id: string;
  folder_id: string;
}
