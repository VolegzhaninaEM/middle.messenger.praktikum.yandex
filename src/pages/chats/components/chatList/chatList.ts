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
      this.arrayChildren.chatList = (chatsData as TChatsData[]).map((chat: TChatsData) => {
        return new ChatPreview('div', {
          ...chat,
          attr: { class: 'chat__list' },
          events: {
            click: (event: unknown) =>
              this.selectChat(event as Event, chat.id as number)
          }
        })
      })
    }
  }

  selectChat(event: Event, chatId: number): void {
    event.preventDefault()
    this.selectedChatId = chatId
    store.set('selectedChatId', chatId)
    console.log('Выбранный чат:', chatId)

    // Уведомляем родительский компонент о выборе чата
    if (
      this.childProps.events &&
      typeof this.childProps.events.onChatSelect === 'function'
    ) {
      ;(this.childProps.events.onChatSelect as (chatId: number) => void)(chatId)
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
