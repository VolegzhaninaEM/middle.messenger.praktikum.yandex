interface IEventBus {
    on(event: string, callback: Function): void;
    emit(event: string, ...args: any[]): void;
  }

type Callback = (...args: any[]) => void;

export class EventBus implements IEventBus{
    private listeners: Record<string, Callback[]> = {};

    on(event: string, callback: Callback): void {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    emit(event: string, ...args: any[]): void {
        if (!this.listeners[event]) {
            return;
        }
        this.listeners[event].forEach(callback => callback(...args));
    }

    off(event: string, callback: Callback): void {
        if (!this.listeners[event]) {
            return;
        }
        this.listeners[event] = this.listeners[event].filter(
            listener => listener !== callback
        );
    }
}
