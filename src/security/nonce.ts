const NONCE_TTL_MS = 5 * 60 * 1000;
const nonceStore = new Map<string, number>();

function pruneExpired(nowMs: number): void {
  for (const [nonce, timestamp] of nonceStore.entries()) {
    if (nowMs - timestamp > NONCE_TTL_MS) {
      nonceStore.delete(nonce);
    }
  }
}

export function registerNonce(nonce: string, nowMs: number): boolean {
  pruneExpired(nowMs);

  if (nonceStore.has(nonce)) {
    return false;
  }

  nonceStore.set(nonce, nowMs);
  return true;
}

export function getNonceTtlMs(): number {
  return NONCE_TTL_MS;
}
