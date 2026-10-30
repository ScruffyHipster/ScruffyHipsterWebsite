import { emptyTimer, readStoredTimer, serializeTimer, STORAGE_KEY, type StoredTimer } from "./breastfeedingTimerModel";

type Change = (current: StoredTimer) => StoredTimer;
type Storage = Pick<globalThis.Storage, "getItem" | "setItem">;
type Locks = Pick<LockManager, "request">;

/** Local-only transactions. Remote notifications never write back to storage. */
export class BreastfeedingTimerStore {
  private base = emptyTimer();
  private snapshot = this.base;
  private pending: Change[] = [];
  private listeners = new Set<(timer: StoredTimer) => void>();
  private flushing = false;
  private storage: Storage | null = null;
  private locks: Locks | null = null;

  connect(storage: Storage | null, locks: Locks | null) {
    this.storage = storage;
    this.locks = locks;
    this.refresh();
  }

  subscribe(listener: (timer: StoredTimer) => void) {
    this.listeners.add(listener);
    listener(this.snapshot);
    return () => { this.listeners.delete(listener); };
  }

  getSnapshot() { return this.snapshot; }

  private read() {
    try {
      const raw = this.storage?.getItem(STORAGE_KEY);
      // Preserve the in-memory copy on malformed data or inaccessible storage.
      return raw === null ? emptyTimer() : readStoredTimer(raw ?? null) ?? this.base;
    } catch {
      this.storage = null;
      return this.base;
    }
  }

  refresh() {
    this.base = this.read();
    this.publish();
  }

  private publish() {
    this.snapshot = this.pending.reduce((state, change) => change(state), this.base);
    this.listeners.forEach((listener) => listener(this.snapshot));
  }

  commit(change: Change) {
    if (!this.pending.length) this.base = this.read();
    const current = this.pending.reduce((state, operation) => operation(state), this.base);
    if (change(current) === current) {
      this.publish();
      return;
    }
    this.pending.push(change);
    // State changes on the tap; persistence never holds up the visible timer.
    this.publish();
    void this.flush();
  }

  private async flush() {
    if (this.flushing) return;
    this.flushing = true;
    try {
      while (this.pending.length) {
        const change = this.pending[0];
        let completed = false;
        const write = () => {
          if (completed) return;
          this.base = change(this.read());
          try { this.storage?.setItem(STORAGE_KEY, serializeTimer(this.base)); }
          catch { this.storage = null; } // Keep working in memory if storage is full or blocked.
          this.pending.shift();
          completed = true;
          this.publish();
        };
        if (this.locks) {
          try { await this.locks.request(STORAGE_KEY, write); }
          catch { write(); }
        } else {
          write();
        }
      }
    } finally {
      this.flushing = false;
    }
  }
}
