import { IncomingHttpHeaders } from 'http';
import { computeHmacSignature, timingSafeEqualHex } from '../security/hmac';
import { getNonceTtlMs, registerNonce } from '../security/nonce';
import { getWorkspaceById } from '../supabase/workspaces';

function readHeader(headers: IncomingHttpHeaders, name: string): string | null {
  const value = headers[name];
  if (!value) {
    return null;
  }
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }
  return value;
}

async function resolveBridgeSecret(
  workspaceId: string | null,
): Promise<string | null> {
  if (workspaceId) {
    const workspace = await getWorkspaceById(workspaceId);
    if (workspace) {
      return workspace.bridgeSecret;
    }
  }

  return process.env.HMAC_SECRET ?? null;
}

export async function verifyBridgeRequest(params: {
  headers: IncomingHttpHeaders;
  body: unknown;
  workspaceId?: string | null;
}): Promise<{ ok: boolean; error?: string }> {
  const signature = readHeader(params.headers, 'x-signature');
  const timestampHeader = readHeader(params.headers, 'x-timestamp');
  const nonce = readHeader(params.headers, 'x-nonce');

  if (!signature || !timestampHeader || !nonce) {
    return { ok: false, error: 'Missing signature headers' };
  }

  const timestampMs = Number(timestampHeader);
  if (!Number.isFinite(timestampMs)) {
    return { ok: false, error: 'Invalid timestamp' };
  }

  const nowMs = Date.now();
  const ttlMs = getNonceTtlMs();
  if (Math.abs(nowMs - timestampMs) > ttlMs) {
    return { ok: false, error: 'Timestamp outside allowed window' };
  }

  const workspaceId =
    params.workspaceId ?? readHeader(params.headers, 'x-workspace-id');
  const secret = await resolveBridgeSecret(workspaceId);
  if (!secret) {
    return { ok: false, error: 'Missing bridge secret' };
  }

  const payload = `${timestampHeader}:${nonce}:${JSON.stringify(
    params.body ?? {},
  )}`;
  const expectedSignature = computeHmacSignature(secret, payload);

  if (!timingSafeEqualHex(signature, expectedSignature)) {
    return { ok: false, error: 'Invalid signature' };
  }

  if (!registerNonce(nonce, nowMs)) {
    return { ok: false, error: 'Nonce already used' };
  }

  return { ok: true };
}
