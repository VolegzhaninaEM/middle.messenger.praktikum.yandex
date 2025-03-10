import { BaseAPI } from './baseApi'
import HttpTransport from './httpTransport'

const chatMessagesAPIInstance = new HttpTransport('api/v1/messages')

class ChatMessagesAPI extends BaseAPI {
  // request({id}) {
  //     return chatMessagesAPIInstance.get(`/${id}`);
  // }
}
