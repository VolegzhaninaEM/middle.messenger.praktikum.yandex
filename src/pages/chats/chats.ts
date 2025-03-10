import './chats.less'
import { Component } from '../../services/component'
import { default as template } from './chats.hbs?raw'
import { TProps, TToken, TUser } from '../../types/types'
import { ChatWindow } from './components/chatWindow/chatWindow'
import { Sidebar } from './components/sidebar/sidebar'
import { connect } from '../../utils/connect'
import chatController from '../../controllers/chatController'
import store from '../../utils/store'
import authController from '../../controllers/authController'

export class ChatPage extends Component {
  constructor(tagName: string = 'main', props: TProps) {
    super(tagName, {
      ...props,
      attr: {
        class: 'messenger'
      }
    })
  }

  async componentDidMount() {
    const chats: Array<TUser> = await chatController.getChats({})
    const userData: TUser = await authController.fetchUser()
    store.set('user', userData)
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
    this.selectedChatId = chatId

    try {
      // Получаем токен для чата
      this.token = await chatController.getChatToken(chatId)

      if (this.children.chatWindow) {
        this.destroy(this.children.chatWindow)
      }

      this.children.chatWindow = new ChatWindow('div', {
        attr: { id: 'chat__window', class: 'chat__window' },
        chatId,
        token: (this.token as TToken).token,
        title: 'Start messaging'
      })

      console.log('Чат открыт:', chatId)
    } catch (error) {
      console.error('Ошибка при открытии чата:', error)
      alert('Не удалось открыть чат')
    }
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
