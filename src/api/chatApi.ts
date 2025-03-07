import { TChatsData } from '../types/types'
import { BaseAPI } from './baseApi'
import { TAddUser, TRemoveUser } from './types/types'

class ChatAPI extends BaseAPI {
  constructor(endpoint: string = '/chats') {
    super(endpoint)
  }

  public getChats(data: TChatsData): Promise<XMLHttpRequest> {
    return this.http.get('', { data })
  }

  public createChat(data: TChatsData): Promise<XMLHttpRequest> {
    return this.http.post('', { data })
  }

  create() {
    return this.http.post('/', { title: 'string' })
  }

  public addUsers(data: TAddUser): Promise<XMLHttpRequest> {
    return this.http.put('/users', { data })
  }
  public removeUsers(data: TRemoveUser): Promise<XMLHttpRequest> {
    return this.http.delete('/users', { data })
  }

  request() {
    return this.http.get('/full')
  }
}

export default new ChatAPI()
