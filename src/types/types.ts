import { USER_INFO } from '../constants/enums'
import { Component } from '../services/component'

export type TProps = Record<string, unknown> & {
  events?: TEvents
  __id?: string | null
  withInternalID?: boolean
  attr?: Record<string, string | Array<string>> & TChildProps
  rootQuery?: string
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

export type Indexed<T = any> = {
  [key in string]: T
}

export type TSignInData = {
  [USER_INFO.login]: string
  [USER_INFO.password]: string
}

export type TSignUpData = {
  [USER_INFO.first_name]: string
  [USER_INFO.second_name]: string
  [USER_INFO.login]: string
  [USER_INFO.email]: string
  [USER_INFO.password]: string
  [USER_INFO.phone]: string
}

export type TRoute = {
  path: string
  component: Component
}
