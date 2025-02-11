import { Component } from '../services/component'

export type TProps = Record<string, unknown> & {
  events?: TEvents
  __id?: string | null
  withInternalID?: boolean
  attr?: Record<string, string | Array<string>> & TChildProps
}
export type TChildren = Record<string, Component>
export type TCallback = (...args: Array<unknown>) => void
export type TEvents = Record<keyof HTMLElementEventMap | string, TCallback>
export type TArrayChildren = Record<string, Array<Component | unknown>>
type TChildProps = {
  class?: string
  isOpen?: boolean
}
export type TMessage = {
  message: string
}

export type TLoginForm = {
  login: string
  password: string
}

export type TRegistrationForm = TLoginForm & {
  email: string
  first_name: string
  second_name: string
  phone: string
  passwordCheck: string
}

export type TProfile = {
  email: string
  login: string
  first_name: string
  second_name: string
  phone: string
  display_name: string
}

export type TData =
  | TLoginForm
  | TRegistrationForm
  | TProfile
  | TProfileFormInputs
  | TMessage

export type TProfileFormInputs = {
  oldPassword: string
  newPassword: string
  newPasswordControl: string
}

export type TElementForm = {
  name: string
  type?: string
  label?: string
  value?: string
  placeholder?: string
}

export type TLinks = { href: string; title: string }
export type TError = {
  message: string
  status?: string
  description?: string
}

export type TAttributesInput = {
  attr: IInput
}

export type TAttributesButton = {
  attr: TButton
}

export interface IInput {
  name: string
  type?: string
  value?: string
  placeholder?: string
  label?: string
}

export interface TButton {
  class?: string
  type?: string
  value: string
}
