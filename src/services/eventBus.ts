export class EventBus<
  T extends Record<string, (...args: Array<unknown>) => void>
> {
  private listeners: Partial<{ [E in keyof T]: Array<T[E]> }> = {}

  on<E extends keyof T>(event: E, callback: T[E]): void {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }
    this.listeners[event].push(callback)
  }

  emit<T extends unknown[]>(event: string, ...args: T): void {
    if (!this.listeners[event]) {
      return
    }
    this.listeners[event].forEach(callback => callback(...args))
  }

  off<E extends keyof T>(event: E, callback: T[E]): void {
    if (!this.listeners[event]) {
      return
    }
    this.listeners[event] = this.listeners[event].filter(
      listener => listener !== callback
    )
  }
}
