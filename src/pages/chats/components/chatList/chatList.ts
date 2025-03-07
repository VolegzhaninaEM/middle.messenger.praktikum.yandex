import { Component } from '../../../../services/component'
import { TChatsData, TProps } from '../../../../types/types'
import { connect } from '../../../../utils/connect'
import store from '../../../../utils/store'
import ChatPreview from '../chatPreview/chatPreview'
import { default as template } from './chatList.hbs?raw'

class ChatList extends Component {
  constructor(tagName: string, props: TProps) {
    super(tagName, props)

    const chatsData = store.getState().chats

    if (!this.arrayChildren.chatList) {
      this.arrayChildren.chatList = chatsData.map(
        (chat: TChatsData) => {
          return new ChatPreview('div', {...chat, attr: { class: 'chat__list' }})
        }
      )
    }
  }

  render(): DocumentFragment {
    return this.compile(template, this.childProps)
  }
}

const withChats = connect(state => ({
  chats: state.chats
}))
export default withChats(ChatList)
