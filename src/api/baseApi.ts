import { TSignInData } from '../types/types'
import HttpTransport from './httpTransport'

export abstract class BaseAPI {
  endpoint: string
  http: HttpTransport

  constructor(endpoint: string = '/') {
    this.endpoint = endpoint
    this.http = new HttpTransport(this.endpoint)
  }
  // На случай, если забудете переопределить метод и используете его, — выстрелит ошибка
  create() {
    throw new Error('Not implemented')
  }

  request() {
    throw new Error('Not implemented')
  }

  update() {
    throw new Error('Not implemented')
  }

  delete() {
    throw new Error('Not implemented')
  }

  signIn(_data: TSignInData): Promise<XMLHttpRequest> {
    throw new Error('Not implemented')
  }

  signUp(_data: TSignInData): Promise<XMLHttpRequest> {
    throw new Error('Not implemented')
  }

  get(_data?: TSignInData): Promise<XMLHttpRequest> {
    throw new Error('Not implemented')
  }

  logout(_data: TSignInData): Promise<XMLHttpRequest> {
    throw new Error('Not implemented')
  }
}
