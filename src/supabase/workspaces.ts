import { v4 as uuidv4 } from 'uuid';
import { Device, Workspace } from '../types/models';
import { requireSupabaseClient } from './client';

const PAIR_TOKEN_TTL_MS = 10 * 60 * 1000;

type PairTokenRow = {
  token: string;
  machine_id: string;
  workspace_fingerprint: string;
  display_name: string;
  expires_at: string;
};

type DeviceRow = {
  id: string;
  platform: 'ios' | 'android';
  push_token: string;
  created_at: string;
  updated_at: string;
};

type WorkspaceRow = {
  id: string;
  device_id: string;
  machine_id: string;
  display_name: string;
  project_fingerprint: string;
  bridge_secret: string;
  created_at: string;
  updated_at: string;
};

function mapDevice(row: DeviceRow): Device {
  return {
    id: row.id,
    platform: row.platform,
    pushToken: row.push_token,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapWorkspace(row: WorkspaceRow): Workspace {
  return {
    id: row.id,
    deviceId: row.device_id,
    machineId: row.machine_id,
    displayName: row.display_name,
    projectFingerprint: row.project_fingerprint,
    bridgeSecret: row.bridge_secret,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function createPairToken(params: {
  machineId: string;
  workspaceFingerprint: string;
  displayName: string;
}): Promise<{ pairToken: string; expiresAt: string }> {
  const client = requireSupabaseClient();
  const token = uuidv4();
  const expiresAt = new Date(Date.now() + PAIR_TOKEN_TTL_MS).toISOString();

  const { data, error } = await client
    .from('pair_tokens')
    .insert({
      token,
      machine_id: params.machineId,
      workspace_fingerprint: params.workspaceFingerprint,
      display_name: params.displayName,
      expires_at: expiresAt,
    })
    .select('token, expires_at')
    .single();

  if (error || !data) {
    throw new Error(`Failed to create pair token: ${error?.message ?? 'unknown error'}`);
  }

  return {
    pairToken: data.token,
    expiresAt: data.expires_at,
  };
}

export async function consumePairToken(token: string): Promise<{
  machineId: string;
  workspaceFingerprint: string;
  displayName: string;
} | null> {
  const client = requireSupabaseClient();
  const { data, error } = await client
    .from('pair_tokens')
    .select('*')
    .eq('token', token)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to read pair token: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  const expiresAtMs = Date.parse(data.expires_at);
  const nowMs = Date.now();

  await client.from('pair_tokens').delete().eq('token', token);

  if (Number.isFinite(expiresAtMs) && expiresAtMs <= nowMs) {
    return null;
  }

  return {
    machineId: data.machine_id,
    workspaceFingerprint: data.workspace_fingerprint,
    displayName: data.display_name,
  };
}

export async function createDeviceAndWorkspace(params: {
  machineId: string;
  workspaceFingerprint: string;
  displayName: string;
  platform: 'ios' | 'android';
  pushToken: string;
}): Promise<{ device: Device; workspace: Workspace }> {
  const client = requireSupabaseClient();

  const { data: deviceRow, error: deviceError } = await client
    .from('devices')
    .insert({
      platform: params.platform,
      push_token: params.pushToken,
    })
    .select('*')
    .single();

  if (deviceError || !deviceRow) {
    throw new Error(`Failed to create device: ${deviceError?.message ?? 'unknown error'}`);
  }

  const bridgeSecret = uuidv4();
  const { data: workspaceRow, error: workspaceError } = await client
    .from('workspaces')
    .insert({
      device_id: deviceRow.id,
      machine_id: params.machineId,
      display_name: params.displayName,
      project_fingerprint: params.workspaceFingerprint,
      bridge_secret: bridgeSecret,
    })
    .select('*')
    .single();

  if (workspaceError || !workspaceRow) {
    await client.from('devices').delete().eq('id', deviceRow.id);
    throw new Error(
      `Failed to create workspace: ${workspaceError?.message ?? 'unknown error'}`,
    );
  }

  return {
    device: mapDevice(deviceRow as DeviceRow),
    workspace: mapWorkspace(workspaceRow as WorkspaceRow),
  };
}

export async function getWorkspaceById(id: string): Promise<Workspace | null> {
  const client = requireSupabaseClient();
  const { data, error } = await client
    .from('workspaces')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch workspace: ${error.message}`);
  }

  return data ? mapWorkspace(data as WorkspaceRow) : null;
}

export async function getDeviceById(id: string): Promise<Device | null> {
  const client = requireSupabaseClient();
  const { data, error } = await client
    .from('devices')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch device: ${error.message}`);
  }

  return data ? mapDevice(data as DeviceRow) : null;
}
