import authApi from '../api/authApi'
import chatApi from '../api/chatApi'
import { ROUTES } from '../constants/enums'
import Router from '../router/router'
import { TChatsData } from '../types/types'

class ChatController {
  public async getChats({ offset = 0, limit = 5 }: TChatsData) {
    try {
      const response = await chatApi.getChats({ offset, limit })
      if (response.status === 200) {
        return response.response
      } else if (response.status === 500) {
        Router.go(ROUTES.ERROR)
      } else {
        throw new Error(response.responseText)
      }
    } catch (error) {
      alert(error)
    }
  }

  public async createChat(data: TChatsData) {
    try {
      const response = await chatApi.createChat(data)
      if (response.status === 200) {
        return response.response
      } else if (response.status === 500) {
        Router.go(ROUTES.ERROR)
      } else {
        throw new Error(response.response.reason)
      }
    } catch (error) {
      alert(error)
    }
  }

  public async fetchUser() {
    try {
      const response = await authApi.fetchUser()

      if (response.status === 200) {
        return response.response
      }
    } catch (error) {
      alert(error)
    }
  }
}

export default new ChatController()
