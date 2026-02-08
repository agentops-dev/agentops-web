import { Approval } from '../types/models';

type Waiter = {
  resolve: (approval: Approval | null) => void;
  timer: NodeJS.Timeout;
};

const waiters = new Map<string, Set<Waiter>>();

export function waitForApprovalDecision(
  approvalId: string,
  timeoutMs: number,
): Promise<Approval | null> {
  return new Promise((resolve) => {
    const waiter: Waiter = {
      resolve,
      timer: setTimeout(() => {
        const set = waiters.get(approvalId);
        if (set) {
          set.delete(waiter);
          if (set.size === 0) {
            waiters.delete(approvalId);
          }
        }
        resolve(null);
      }, timeoutMs),
    };

    const set = waiters.get(approvalId) ?? new Set<Waiter>();
    set.add(waiter);
    waiters.set(approvalId, set);
  });
}

export function notifyApprovalUpdated(approval: Approval): void {
  const set = waiters.get(approval.id);
  if (!set) {
    return;
  }

  waiters.delete(approval.id);
  for (const waiter of set) {
    clearTimeout(waiter.timer);
    waiter.resolve(approval);
  }
}
