import { METHODS } from './enums'

export type Options = {
  headers?: Record<string, string>
  method: METHODS
  data?: unknown
  timeout?: number
  credentials?: string
  mode?: string
  title?: string
}
export type HTTPMethod = (
  url: string,
  options?: GeneralOptions
) => Promise<XMLHttpRequest>

export type HTTPRequest = (
  url: string,
  options: Options
) => Promise<XMLHttpRequest>

export type GeneralOptions = Omit<Options, 'method'>

export type TAddUser = {
  users: Array<number>
  chatId: number
}
export type TRemoveUser = {
  users: Array<number>
  chatId: number
}
