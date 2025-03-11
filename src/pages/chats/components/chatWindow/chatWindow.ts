import { ChatMessage } from '../../../../components'
import { StoreEvents } from '../../../../constants/enums'
import { Component } from '../../../../services/component'
import {
  Indexed,
  TChatData,
  TChatsData,
  TMessageInfo,
  TProps,
  TUser
} from '../../../../types/types'
import store from '../../../../utils/store'
import { ChatWebSocket } from '../../../../webSocket/webSocket'
import { ChatFooter } from '../chatFooter/chatFooter'
import { ChatHeader } from '../chatHeader/chatHeader'
import { EmptyChat } from '../chatWindowEmpty/chatWindowEmpty'
import { default as template } from './chatWindow.hbs?raw'

type TChatWindowProps = TProps & {
  socket?: ChatWebSocket; // Указываем тип для socket
}
export class ChatWindow extends Component {
  private storeInfo: Indexed<unknown>
  constructor(tagName: string, props: TChatWindowProps) {
    super(tagName, props)
    this.storeInfo = store.getState()
    const token = this.storeInfo.token
    const chatId = this.storeInfo.selectedChatId

    // Подписываемся на изменения в store
    store.on(StoreEvents.Updated, () => {
      this.updateMessages(); // Перерисовываем компонент при изменении сообщений
    });

      if (!this.arrayChildren.messageHistory) {
        this.arrayChildren.messageHistory = []
      }
    

    if (!this.children.header && token) {
      this.children.header = new ChatHeader('div', {
        attr: { class: 'chat__header' },
        chatId
      })
    }

    const chatInfo = (this.storeInfo.chats as TChatData[]).find(
      (chat: TChatsData) => chat.id === chatId
    )
    if ((!this.children.isEmpty && !token) || !chatInfo?.last_message) {
      this.children.isEmpty = new EmptyChat('div', {
        title: this.childProps.token
          ? 'Start messaging'
          : 'Select a chat to start messaging',
        chat: chatInfo
      })
    }

    if (!this.children.footer && token) {
      this.children.footer = new ChatFooter('div', {
        chatId,
        socket: this.childProps.socket as ChatWebSocket
      })
    }

    const container = this.element?.querySelector('.chat__message')
    if (container) {
      container.scrollTop = container.scrollHeight
    }
  }

  updateMessages(): void {
    const messages = store.getState().messages || [];
    this.setProps({ messages }); // Обновляем свойства компонента
    this.displayMessage(messages as TMessageInfo)
  }

  destroy(): void {
    if (this.element) {
      this.element.remove() // Удаляем элемент из DOM
    }
  }

  displayMessage(message: TMessageInfo): void {
    let currentMessages = (this.childProps.messages as TMessageInfo[]) || []
    // Если это массив сообщений (история)
    if (Array.isArray(message)) {
      currentMessages = [...message] // Заменяем старые сообщения новыми
    }
    // Если это одно сообщение
    else if (message.content && message.time) {
      currentMessages = [...currentMessages, message] // Добавляем новое сообщение
    }

    // Сортируем сообщения по времени
    currentMessages
      .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
      .reverse()

    this.setProps({ messages: currentMessages })

    if (this.arrayChildren.messageHistory.length) {
      this.arrayChildren.messageHistory = []
    }

    if (!this.arrayChildren.messageHistory.length) {
      const messagesList = this.childProps.messages as []
      const components = messagesList?.map((messageInfo: TMessageInfo) => {
        const senderClass =
          (this.storeInfo.user as TUser).id !== messageInfo.user_id
            ? 'message__outcoming'
            : 'message__inpcoming'
        return new ChatMessage('div', {
          attr: { class: `message ${senderClass}` },
          message: {
            text:
              JSON.parse(messageInfo.content).content?.message ||
              JSON.parse(messageInfo.content)?.message,
            time: messageInfo.time
          }
        })
      })
      this.arrayChildren.messageHistory = components.map(component => {
        return component
      })
    }
  }

  render(): DocumentFragment {
    return this.compile(template, this.childProps)
  }
}
