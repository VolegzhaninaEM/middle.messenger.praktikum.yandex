import { TMessageInfo, TUser } from '../types/types'
import store from '../utils/store'

export class ChatWebSocket {
  protected socket: WebSocket | null = null

  constructor() {
    // Инициализация свойств
    this.socket = null
  }
  connect(
    chatId: number,
    userId: number,
    token: string,
    onMessage: (message: TMessageInfo) => void
  ): void {
    if (this.socket) {
      this.disconnect() // Закрываем предыдущее соединение, если оно существует
    }

    this.socket = new WebSocket(
      `wss://ya-praktikum.tech/ws/chats/${userId}/${chatId}/${token}`
    )

    this.socket.onopen = () => {
      console.log('Соединение установлено')
      this.sendPing()
      this.getMessageHistory()
    }

    this.socket.onmessage = event => {
      const data = event.data
      try {
        // Пытаемся распарсить данные как JSON
        const parsedData = JSON.parse(data)

        if (Array.isArray(parsedData)) {
          const currentMessages =
            (store.getState().messages as TMessageInfo[]) || []
          parsedData.forEach(message => {
            currentMessages.push(message)
          })
          store.set('messages', [...currentMessages]) // Обрабатываем массив сообщений
        } else if (parsedData.content) {
          onMessage(parsedData) // Обрабатываем одно сообщение
        }
      } catch (error) {
        // Если данные не являются JSON, выводим их в консоль или игнорируем
        console.warn('Получено не JSON-сообщение:', data)
      }
    }

    this.socket.onclose = event => {
      if (event.wasClean) {
        console.log('Соединение закрыто чисто')
      } else {
        console.log('Обрыв соединения')
      }

      console.log(`Код: ${event.code} | Причина: ${event.reason}`)
    }

    this.socket.onerror = error => {
      console.error('Ошибка:', error)
    }
  }

  sendMessage(message: string) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      const messageText =
        typeof message === 'string' ? message : JSON.stringify(message)

      // Отправляем сообщение через WebSocket
      this.socket.send(
        JSON.stringify({ content: messageText, type: 'message' })
      )

      const storeInfo = store.getState()

      // Добавляем отправленное сообщение в store
      const currentMessages = (storeInfo.messages as TMessageInfo[]) || []
      const messageId = currentMessages.length ? ++currentMessages.length : 1
      const newMessage = {
        id: messageId, // Уникальный ID для сообщения
        content: JSON.stringify(messageText),
        time: new Date().toISOString(),
        type: 'message',
        user_id: (storeInfo.user as TUser).id,
        chat_id: storeInfo.selectedChatId
      }
      store.set('messages', [...currentMessages, newMessage])
    }
  }

  sendPing(): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type: 'ping' }))
    }
  }

  getMessageHistory(): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ content: '0', type: 'get old' }))
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close()
      this.socket = null
    }
  }
}
