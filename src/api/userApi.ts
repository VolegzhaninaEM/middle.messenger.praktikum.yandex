import { TPassword, TUser } from '../types/types'
import { BaseAPI } from './baseApi'

class UserAPI extends BaseAPI {
  constructor(endpoint: string = '/user') {
    super(endpoint)
  }

  submitChanges(data: TUser) {
    return this.http.put('/profile', { data })
  }

  public changeAvatar(data: FormData): Promise<XMLHttpRequest> {
    return this.http.put('/profile/avatar', {
      data
    })
  }

  public changePassword(data: TPassword): Promise<XMLHttpRequest> {
    return this.http.put('/password', {
      data
    })
  }

  public searchUserByLogin(data: { login: string }): Promise<XMLHttpRequest> {
    return this.http.post(`/search`, { data })
  }
}

export default new UserAPI()
