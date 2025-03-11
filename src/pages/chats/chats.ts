import './chats.less'
import { Component } from '../../services/component'
import { default as template } from './chats.hbs?raw'
import { TMessageInfo, TProps, TToken, TUser } from '../../types/types'
import { ChatWindow } from './components/chatWindow/chatWindow'
import { Sidebar } from './components/sidebar/sidebar'
import { connect } from '../../utils/connect'
import chatController from '../../controllers/chatController'
import store from '../../utils/store'
import authController from '../../controllers/authController'
import { ChatWebSocket } from '../../webSocket/webSocket'

export class ChatPage extends Component {
  chatWebSocket: ChatWebSocket;
  
  constructor(tagName: string = 'main', props: TProps) {
    super(tagName, {
      ...props,
      attr: {
        class: 'messenger'
      }
    })

    this.chatWebSocket = new ChatWebSocket();
    console.log(this.chatWebSocket.connect); 
  }

  async componentDidMount() {
    const chats: Array<TUser> = await chatController.getChats({})
    store.set('chats', chats)
    this.initData()
  }

  initData() {
    if (!this.children.sidebar) {
      this.children.sidebar = new Sidebar('div', {
        events: {
          onChatSelect: (chatId: unknown) => this.openChat(chatId as number)
        }
      })
    }
    if (!this.children.chatWindow) {
      this.children.chatWindow = new ChatWindow('div', {
        attr: { id: 'chat__window', class: 'chat__window' }
      })
    }
  }

  public async openChat(chatId: number): Promise<void> {
    try {
      // Получаем токен для чата
      const token = (await chatController.getChatToken(chatId) as TToken).token
      const userId = (store.getState().user as TUser).id
      if (!token || !userId) {
        console.error('Токен или ID пользователя отсутствуют');
        return;
      }

      store.set('token', token)
      store.set('selectedChatId', chatId);

      this.connectToChat(chatId, userId, token);

      if (this.children.chatWindow) {
        this.destroy(this.children.chatWindow)
      }

      this.children.chatWindow = new ChatWindow('div', {
        attr: { id: 'chat__window', class: 'chat__window' },
        title: 'Start messaging',
        socket: this.chatWebSocket
      })

      console.log('Чат открыт:', chatId)
    } catch (error) {
      console.error('Ошибка при открытии чата:', error)
      alert('Не удалось открыть чат')
    }
  }

  connectToChat(chatId: number, userId: number, token: string): void {
    // Подключаемся к новому чату
    this.chatWebSocket.connect(
      chatId,
      userId,
      token,
      (message) => {
        // Обновляем сообщения в store
        const currentMessages = store.getState().messages as TMessageInfo[]|| [];
        store.set('messages', [...currentMessages, message]);
      }
    );
  }

  destroy(element: Component): void {
    if (element) {
      element.getContent()?.remove() // Удаляем элемент из DOM
    }
  }

  render(): DocumentFragment {
    return this.compile(template, this.childProps)
  }
}

const withChatId = connect(state => ({
  chats: state.chats,
  user: state.user
}))
export default withChatId(ChatPage)
