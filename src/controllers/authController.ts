import authApi from '../api/authApi'
import { ROUTES } from '../constants/enums'
import Router from '../router/router'
import { TSignInData, TSignUpData } from '../types/types'
import { validateForm } from '../utils/validators'

class AuthController {
  private readonly api: typeof authApi
  constructor() {
    this.api = authApi
  }
  public async signIn(data: TSignInData) {
    const errors = validateForm(data)
    if (!errors) {
      try {
        const response = await this.api.signIn(data)
        if (response.status === 200) {
          Router.go(ROUTES.CHATS)
        } else if (response.status === 500) {
          Router.go(ROUTES.ERROR)
        } else {
          throw new Error(JSON.stringify(response.response))
        }
      } catch (error: unknown) {
        if (
          JSON.parse((error as Error).message).reason ===
          'User already in system'
        )
          Router.go(ROUTES.CHATS)
        else alert('Ошибка авторизации:' + error)
      }
    }
  }

  public async signUp(data: TSignUpData) {
    const errors = validateForm(data)
    if (!errors) {
      try {
        const response = await this.api.signUp(data)
        if (response.status === 200) {
          Router.go(ROUTES.CHATS)
        } else if (response.status === 500) {
          Router.go(ROUTES.ERROR)
        } else {
          throw new Error(JSON.stringify(response.response))
        }
      } catch (error: unknown) {
        if (
          JSON.parse((error as Error).message).reason ===
          'User already in system'
        )
          Router.go(ROUTES.CHATS)
        else alert('Ошибка авторизации:' + error)
      }
    }
  }

  public async logout() {
    try {
      const response = await this.api.logout()
      if (response.status === 200) {
        Router.go(ROUTES.LOGIN)
      }
    } catch (error) {
      alert(error)
    }
  }

  public async fetchUser() {
    try {
      const response = await this.api.fetchUser()

      if (response.status === 200) {
        return response.response
      }
    } catch (error) {
      alert(error)
    }
  }
}

export default new AuthController()
