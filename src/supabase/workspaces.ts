import { v4 as uuidv4 } from 'uuid';
import { Device, Workspace } from '../types/models';
import { memoryStore, PAIR_TOKEN_TTL_MS, pruneExpiredPairTokens } from './store';

export async function createPairToken(params: {
  machineId: string;
  workspaceFingerprint: string;
  displayName: string;
}): Promise<{ pairToken: string; expiresAt: string }> {
  const nowMs = Date.now();
  const token = uuidv4();
  const expiresAtMs = nowMs + PAIR_TOKEN_TTL_MS;

  memoryStore.pairTokens.set(token, {
    token,
    machineId: params.machineId,
    workspaceFingerprint: params.workspaceFingerprint,
    displayName: params.displayName,
    expiresAt: expiresAtMs,
  });

  return {
    pairToken: token,
    expiresAt: new Date(expiresAtMs).toISOString(),
  };
}

export async function consumePairToken(token: string): Promise<{
  machineId: string;
  workspaceFingerprint: string;
  displayName: string;
} | null> {
  const nowMs = Date.now();
  pruneExpiredPairTokens(nowMs);

  const record = memoryStore.pairTokens.get(token);
  if (!record) {
    return null;
  }

  if (record.expiresAt <= nowMs) {
    memoryStore.pairTokens.delete(token);
    return null;
  }

  memoryStore.pairTokens.delete(token);

  return {
    machineId: record.machineId,
    workspaceFingerprint: record.workspaceFingerprint,
    displayName: record.displayName,
  };
}

export async function createDeviceAndWorkspace(params: {
  machineId: string;
  workspaceFingerprint: string;
  displayName: string;
  platform: 'ios' | 'android';
  pushToken: string;
}): Promise<{ device: Device; workspace: Workspace }> {
  const nowIso = new Date().toISOString();
  const device: Device = {
    id: uuidv4(),
    platform: params.platform,
    pushToken: params.pushToken,
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  memoryStore.devices.set(device.id, device);

  const workspace: Workspace = {
    id: uuidv4(),
    deviceId: device.id,
    machineId: params.machineId,
    displayName: params.displayName,
    projectFingerprint: params.workspaceFingerprint,
    bridgeSecret: uuidv4(),
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  memoryStore.workspaces.set(workspace.id, workspace);

  return { device, workspace };
}

export async function getWorkspaceById(id: string): Promise<Workspace | null> {
  return memoryStore.workspaces.get(id) ?? null;
}

export async function getDeviceById(id: string): Promise<Device | null> {
  return memoryStore.devices.get(id) ?? null;
}
