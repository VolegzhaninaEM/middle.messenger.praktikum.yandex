import { METHODS } from './enums'

export type Options = {
  headers?: Record<string, string>
  method: METHODS
  data?: unknown
  timeout?: number
  credentials?: string
  mode?: string
  title?: string
  id?: number
}
export type HTTPMethod = (
  url: string,
  options?: GeneralOptions
) => Promise<XMLHttpRequest>

export type TFetch = (
  url: string,
  id?: number
) => Promise<Response>

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
