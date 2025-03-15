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
    const chatId = this.childProps.selectedChatId

    // Подписываемся на изменения в store
    store.on(StoreEvents.Updated, () => {
      const currentMessages =
        (store.getState().messages as TMessageInfo[]) || []

      if (
        !isEqual(this.previousMessages, currentMessages)
      ) {
        this.previousMessages = currentMessages
        console.log('Сообщения изменились:', currentMessages)

        // Обновляем isEmpty
        this.setProps({ isEmpty: currentMessages.length === 0 })

        // Если выбран тот же чат, но добавлены новые сообщения
        if (this.storeInfo.inputMessage) {
          this.handleNewMessages() // Перерисовываем компонент при изменении сообщений
        } else {
          // Если выбран новый чат
          // Обновляем состояние storeInfo
          this.storeInfo = store.getState()

          // Обновляем сообщения для нового чата
          this.updateMessages()
        }
      }
    })

    // Инициализируем isEmpty
    const initialMessages = (store.getState().messages as TMessageInfo[]) || []
    this.setProps({ isEmpty: initialMessages.length === 0 })

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
    if ((!this.children.emptyTitle && !token) || !chatInfo?.last_message) {
      this.children.emptyTitle = new EmptyChat('div', {
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

  componentDidUpdate(oldProps: TProps, newProps: TProps) {
    return oldProps !== newProps
  }

  updateMessages(): void {
    const messages = (store.getState().messages as TMessageInfo[]) || []
    const selectedChatId = store.getState().selectedChatId
    // Фильтруем сообщения по выбранному чату
    const filteredMessages = messages.filter(
      (message: TMessageInfo) => message?.chat_id === selectedChatId
    )

    this.childProps.messages = [...filteredMessages]
    this.displayMessage([...filteredMessages])
  }

  handleNewMessages(): void {
    const selectedChatId = store.getState().selectedChatId
    const messages = (store.getState().messages as TMessageInfo[]) || []

    // Фильтруем сообщения по выбранному чату
    const filteredMessages = messages.filter(
      (message: TMessageInfo) => message?.chat_id === selectedChatId
    )

    // Текущие сообщения
    const currentMessages = (this.childProps.messages as TMessageInfo[]) || []

    // Находим новые сообщения (по id)
    const newMessages = filteredMessages.filter(
      (newMessage: TMessageInfo) =>
        !currentMessages.some((msg: TMessageInfo) => msg?.id === newMessage.id)
    )

    if (newMessages.length > 0) {
      // Добавляем новые сообщения к текущим
      const updatedMessages = [...currentMessages, ...newMessages]

      // Сортируем сообщения по времени
      updatedMessages.sort(
        (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
      )

      this.childProps.messages = updatedMessages

      // Обновляем isEmpty
      this.setProps({ isEmpty: updatedMessages.length === 0 })

      this.displayMessage(updatedMessages)
    }
  }

  destroy(): void {
    if (this.element) {
      this.element.remove() // Удаляем элемент из DOM
    }
  }

  displayMessage(messages: TMessageInfo[]): void {
    // Сортируем сообщения по времени
    const currentMessages = messages
      .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
      .reverse()

    // Создаем новые дочерние компоненты для каждого сообщения
    const components = currentMessages.map((messageInfo: TMessageInfo) => {
      if (messageInfo) {
        const senderClass =
          (this.storeInfo.user as TUser).id !== messageInfo.user_id
            ? 'message__outcoming'
            : 'message__incoming'

        return new ChatMessage('div', {
          attr: { class: `message ${senderClass}` },
          message: {
            text: messageInfo.content,
            time: messageInfo.time
          }
        })
      }
    })

    // Обновляем массив дочерних компонентов
    this.arrayChildren.messageHistory = components

    // Передаем новые сообщения в свойства компонента
    this.childProps.messages = currentMessages
  }

  render(): DocumentFragment {
    return this.compile(template, {
      ...this.childProps,
      children: this.children,
      arrayChildren: this.arrayChildren
    })
  }
}

const withChats = connect(state => ({
  chats: state.chats,
  messages: state.messages
}))
export default withChats(ChatWindow)
