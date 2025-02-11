import { EVENTS } from './enums'

export interface IEvents {
  [key: string]: (...args: unknown[]) => void
  [EVENTS.INIT]: () => void
  [EVENTS.FLOW_CDM]: () => void
  [EVENTS.FLOW_CDU]: (...args: Array<unknown>) => void
  [EVENTS.FLOW_RENDER]: () => void
}
