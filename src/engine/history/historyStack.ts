import type { HistorySnapshot } from '@/types/editor';
import { deepClone } from '@/utils/clone';

export class HistoryStack {
  private readonly limit: number;

  private stack: HistorySnapshot[] = [];

  private cursor = -1;

  public constructor(limit = 30) {
    this.limit = limit;
  }

  public push(snapshot: HistorySnapshot): void {
    const normalized = deepClone(snapshot);
    this.stack = this.stack.slice(0, this.cursor + 1);
    this.stack.push(normalized);

    if (this.stack.length > this.limit) {
      this.stack.shift();
    }

    this.cursor = this.stack.length - 1;
  }

  public undo(): HistorySnapshot | null {
    if (this.cursor <= 0) {
      return null;
    }

    this.cursor -= 1;
    return deepClone(this.stack[this.cursor]);
  }

  public redo(): HistorySnapshot | null {
    if (this.cursor >= this.stack.length - 1) {
      return null;
    }

    this.cursor += 1;
    return deepClone(this.stack[this.cursor]);
  }

  public clear(): void {
    this.stack = [];
    this.cursor = -1;
  }
}
