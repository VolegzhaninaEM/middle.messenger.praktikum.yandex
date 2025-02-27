import { StoreEvents } from "../constants/enums";
import { EventBus } from "../services/eventBus";
import { Indexed } from "../types/types";
import { set } from "./helpers";

class Store extends EventBus<Record<string, (...args: unknown[]) => void>>{
  private state: Indexed = {}

  public getState() {
    return this.state
  }

  public set(path: string, value: unknown) {
    set(this.state, path, value)
    // метод EventBus
    this.emit(StoreEvents.Updated)
  }
}

export default new Store(); 
