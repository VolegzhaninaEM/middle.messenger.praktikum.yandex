import './chats.less'
import { Component } from '../../services/component'
import { default as template } from './chats.hbs?raw'
import { TProps } from '../../types/types'
import { ChatWindow } from './components/chatWindow/chatWindow'
import { Sidebar } from './components/sidebar/sidebar'
import { connect } from '../../utils/connect'

export class ChatPage extends Component {
  constructor(tagName: string = 'main', props: TProps) {
    super(tagName, {
      ...props,
      attr: {
        class: 'messenger'
      }
    })

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

const withUser = connect( state => ({user: state.user}))
export default withUser(ChatPage)
