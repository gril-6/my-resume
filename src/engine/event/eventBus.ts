type EventMap = {
  preview: void;
  exportJson: void;
  importJson: string;
  clearCanvas: void;
};

type EventName = keyof EventMap;
type Handler<T extends EventName> = (payload: EventMap[T]) => void;

class EventBus {
  private handlers = new Map<EventName, Set<Handler<EventName>>>();

  public on<T extends EventName>(event: T, handler: Handler<T>): () => void {
    const current = this.handlers.get(event) ?? new Set<Handler<EventName>>();
    current.add(handler as Handler<EventName>);
    this.handlers.set(event, current);
    return () => this.off(event, handler);
  }

  public off<T extends EventName>(event: T, handler: Handler<T>): void {
    this.handlers.get(event)?.delete(handler as Handler<EventName>);
  }

  public emit<T extends EventName>(event: T, payload: EventMap[T]): void {
    this.handlers.get(event)?.forEach((handler) => handler(payload));
  }
}

export const eventBus = new EventBus();
