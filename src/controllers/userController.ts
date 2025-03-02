import userApi from '../api/userApi'
import { ROUTES } from '../constants/enums'
import router from '../router/router'
import { TUser } from '../types/types'
import { validateForm } from '../utils/validators'

class UserController {
  private readonly api: typeof userApi
  constructor() {
    this.api = userApi
  }
  public async submitChanges(data: TUser) {
    const errors = validateForm(data)
    if (!errors) {
      const response = await this.api.submitChanges(data)
      if (response.status === 200) {
        return response.status
      } else {
        throw new Error(JSON.stringify(response.response))
      }
    }
  }

  async changeAvatar(data: FormData) {
    try {
      const response = await this.api.changeAvatar(data)
      if (response.status === 200) {
        return response.response
      } else if (response.status === 500) {
        router.go(ROUTES.ERROR)
      } else {
        throw new Error(response.responseText)
      }
    } catch (error) {
      alert(error)
    }
  }
}

export default new UserController()
