import { METHODS } from "./enums"

export type Options = {
  headers?: Record<string, string>
  method: METHODS
  data?: unknown
  timeout?: number
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
