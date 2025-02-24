import authApi from '../api/authApi'
import { ROUTES } from '../constants/enums'
import Router from '../router/router'
import { TSignInData, TSignUpData } from '../types/types'
import { validateForm } from '../utils/validators'

class AuthController {
  public async signIn(data: TSignInData) {
    const errors = validateForm(data)
    if (!errors) {
      const response = await authApi.signIn(data)
      if (response.status === 200) {
        Router.go('/messenger')
      }

      if (response.status === 400) {
        Router.go('*')
      }
    }
  }

  public async signUp(data: TSignUpData) {
    const errors = validateForm(data)
    if (!errors) {
      const response = await authApi.signUp(data)
      if (response.status === 200) {
        Router.go('/messenger')
      }

      if (response.status === 400) {
        Router.go('*')
      }
    }
  }

  public async logout() {
    try {
      const response = await authApi.logout()
      if (response.status === 200) {
        Router.go(ROUTES.LOGIN)
      }
    } catch (error) {
      alert(error)
    }
  }
}

export default new AuthController()
