import authApi from '../api/authApi'
import chatApi from '../api/chatApi'
import { ROUTES } from '../constants/enums'
import Router from '../router/router'
import { TChatsData } from '../types/types'
import userController from './userController'

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

  public async getChatToken(id: number) {
    try {
      const response = await chatApi.getChatToken(id)

      if (response.status === 200) {
        return response.json()
      }

      if (!response.ok) {
        throw new Error('Ошибка при получении токена чата')
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

  async addUser(data: { login: string; chatId: number }) {
    try {
      const { login, chatId } = data
      const userData = await userController.searchUserByLogin({ login })
      if (userData.length > 0) {
        const response = await chatApi.addUsers({
          users: [userData[0].id],
          chatId
        })

        if (response.status === 500) {
          Router.go(ROUTES.ERROR)
        } else if (response.status !== 200) {
          throw new Error(response.responseText)
        }
      } else {
        throw new Error('User not found')
      }
    } catch (error) {
      alert(error)
    }
  }

  async removeUser(data: { login: string; chatId: number }) {
    try {
      const { login, chatId } = data
      const userData = await userController.searchUserByLogin({ login })
      if (userData.length > 0) {
        const response = await chatApi.removeUsers({
          users: [userData[0].id],
          chatId
        })

        if (response.status === 500) {
          Router.go(ROUTES.ERROR)
        } else if (response.status !== 200) {
          throw new Error(response.responseText)
        }
      } else {
        throw new Error('User not found')
      }
    } catch (error) {
      alert(error)
    }
  }
}

export default new ChatController()
