import './chats.less'
import { Component } from '../../services/component'
import { default as template } from './chats.hbs?raw'
import { TProps, TUser } from '../../types/types'
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
      this.children.sidebar = new Sidebar('div', {})
    }
    if (!this.children.chatWindow) {
      this.children.chatWindow = new ChatWindow('div', {
        attr: { id: 'chat__window', class: 'chat__window' }
      })
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
