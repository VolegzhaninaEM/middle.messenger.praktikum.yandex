import { ROUTES } from '../constants/enums'
import { TSignInData, TSignUpData } from '../types/types'
import { BaseAPI } from './baseApi'

class AuthAPI extends BaseAPI {
  constructor(endpoint: string = '/auth') {
    super(endpoint)
  }

  signIn(data: TSignInData): Promise<XMLHttpRequest> {
    return this.http.post(ROUTES.LOGIN, { data })
  }

  signUp(data: TSignUpData): Promise<XMLHttpRequest> {
    return this.http.post(ROUTES.SIGN_UP, { data })
  }

  get(): Promise<XMLHttpRequest> {
    return this.http.get('/user')
  }

  logout(): Promise<XMLHttpRequest> {
    return this.http.post('/logout')
  }
}

export default new AuthAPI()
