import { TChatsData } from '../types/types'
import { BaseAPI } from './baseApi'

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

  request() {
    return this.http.get('/full')
  }
}

export default new ChatAPI()
