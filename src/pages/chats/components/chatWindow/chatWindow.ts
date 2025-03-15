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
import { connect } from '../../../../utils/connect'
import { isEqual } from '../../../../utils/helpers'
import store from '../../../../utils/store'
import { ChatWebSocket } from '../../../../webSocket/webSocket'
import { ChatFooter } from '../chatFooter/chatFooter'
import { ChatHeader } from '../chatHeader/chatHeader'
import { EmptyChat } from '../chatWindowEmpty/chatWindowEmpty'
import { default as template } from './chatWindow.hbs?raw'

type TChatWindowProps = TProps & {
  socket?: ChatWebSocket // Указываем тип для socket
}
class ChatWindow extends Component {
  private storeInfo: Indexed<unknown>
  private previousMessages: TMessageInfo[] = []
  constructor(tagName: string, props: TChatWindowProps) {
    super(tagName, props)
    this.storeInfo = { ...store.getState(), selectedChatId: null }
    const token = this.storeInfo.token as string
    const chatId = this.storeInfo.selectedChatId

    // Подписываемся на изменения в store
    store.on(StoreEvents.Updated, () => {
      const currentMessages =
        (store.getState().messages as TMessageInfo[]) || []

      if (!isEqual(this.previousMessages, currentMessages) && this.childProps.socket ) {
        console.log('Сообщения изменились:', currentMessages)

        const newChatId = store.getState().selectedChatId as number
        // Если выбран новый чат
        if (newChatId !== chatId) {
          // Обновляем состояние storeInfo
          this.storeInfo = store.getState()
          
          // Обновляем сообщения для нового чата
          this.updateMessages()
        }
        // Если выбран тот же чат, но добавлены новые сообщения
        if (this.storeInfo.inputMessage) {
          this.handleNewMessages() // Перерисовываем компонент при изменении сообщений
        }
      }
    })

    this.storeInfo = store.getState()

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
    const messages = (store.getState().messages as TMessageInfo[]) || []
    const selectedChatId = store.getState().selectedChatId
    // Фильтруем сообщения по выбранному чату
    const filteredMessages = messages.filter(
      (message: TMessageInfo) => message.chat_id === selectedChatId
    )

    this.setProps({ messages: filteredMessages }) // Обновляем свойства компонента
    this.displayMessage(filteredMessages)
  }

  handleNewMessages(): void {
    const selectedChatId = store.getState().selectedChatId
    const messages = (store.getState().messages as TMessageInfo[]) || []

    // Фильтруем сообщения по выбранному чату
    const filteredMessages = messages.filter(
      (message: TMessageInfo) => message.chat_id === selectedChatId
    )

    // Текущие сообщения
    const currentMessages = (this.childProps.messages as TMessageInfo[]) || []

    // Находим новые сообщения (по id)
    const newMessages = filteredMessages.filter(
      (newMessage: TMessageInfo) =>
        !currentMessages.some((msg: TMessageInfo) => msg.id === newMessage.id)
    )

    if (newMessages.length > 0) {
      // Добавляем новые сообщения к текущим
      const updatedMessages = [...currentMessages, ...newMessages]

      // Сортируем сообщения по времени
      updatedMessages.sort(
        (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
      )

      this.setProps({ messages: updatedMessages })
      this.displayMessage(updatedMessages)
    }
  }

  destroy(): void {
    if (this.element) {
      this.element.remove() // Удаляем элемент из DOM
    }
  }

  displayMessage(message: TMessageInfo[] | TMessageInfo): void {
    let currentMessages = (this.childProps.messages as TMessageInfo[]) || []
    // Если это массив сообщений (история)
    if (Array.isArray(message)) {
      currentMessages = [...message] // Заменяем старые сообщения новыми
    }
    // Если это одно сообщение
    else if (message.content && message.time) {
      const isDuplicate = currentMessages.some(msg => msg.id === message.id)
      if (!isDuplicate) {
        currentMessages = [...currentMessages, message] // Добавляем новое сообщение
      }
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
            text: messageInfo.content,
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

const withChats = connect(state => ({
  chats: state.chats
}))
export default withChats(ChatWindow)
