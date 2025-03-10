import { ChatMessage } from '../../../../components'
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

export class ChatWindow extends Component {
  private storeInfo: Indexed<{
    id: number
    find(arg0: (chat: TChatsData) => boolean): TChatData
    user: TUser
  }>
  constructor(tagName: string, props: TProps) {
    super(tagName, props)
    const { chatId, token } = props
    this.storeInfo = store.getState()

    if (this.webSocket) {
      this.webSocket.disconnect()
    }
    if (token) {
      if (!this.webSocket) {
        this.webSocket = new ChatWebSocket()
      }
      this.webSocket.connect(
        chatId as number,
        this.storeInfo.user.id as number,
        token as string,
        (message: TMessageInfo) => this.displayMessage(message)
      )

      if (!this.arrayChildren.messageHistory) {
        this.arrayChildren.messageHistory = []
      }
    }

    if (!this.children.header && this.childProps.token) {
      this.children.header = new ChatHeader('div', {
        attr: { class: 'chat__header' },
        chatId
      })
    }

    const chatInfo: TChatData = this.storeInfo.chats.find(
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

    if (!this.children.footer && this.childProps.token) {
      this.children.footer = new ChatFooter('div', {
        chatId,
        socket: this.webSocket as ChatWebSocket
      })
    }

    const container = this.element?.querySelector('.chat__message')
    if (container) {
      container.scrollTop = container.scrollHeight
    }
  }

  componentDidUpdate(oldProps: TProps, newProps: TProps) {
    return oldProps !== newProps
  }

  destroy(): void {
    if (this.element) {
      this.element.remove() // Удаляем элемент из DOM
    }
  }

  displayMessage(message: TMessageInfo): void {
    let currentMessages = (this.childProps.messages as []) || []
    if (Array.isArray(message)) {
      // Если массив сообщений — это история чата
      this.setProps({ messages: message }) // Обновляем состояние компонента
    } else if (message.content) {
      this.setProps({ messages: [message, ...currentMessages] })
    }

    if (this.arrayChildren.messageHistory.length) {
      this.arrayChildren.messageHistory = []
    }

    if (!this.arrayChildren.messageHistory.length) {
      const messagesList = this.childProps.messages as []
      const components = messagesList?.map((messageInfo: TMessageInfo) => {
        const senderClass =
          this.storeInfo.user.id !== messageInfo.user_id
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
