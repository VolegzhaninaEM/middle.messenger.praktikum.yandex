import { BaseAPI } from './baseApi'

class UserAvatarAPI extends BaseAPI {
  constructor(endpoint: string = '/user/profile/avatar') {
    super(endpoint)
  }

  public changeAvatar(data: FormData): Promise<Response> {
    return fetch(`https://ya-praktikum.tech/api/v2${this.endpoint}`, {
      method: 'PUT', // Используем PUT-запрос
      body: data, // Передаем FormData в теле запроса
      credentials: 'include', // Нам нужно подставлять cookies
      mode: 'cors', // Работаем с CORS
    })
  }
}

export default new UserAvatarAPI()
