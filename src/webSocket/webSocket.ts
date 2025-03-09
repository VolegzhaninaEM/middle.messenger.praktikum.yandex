export class ChatWebSocket {
  protected socket: WebSocket | null = null

  connect(
    chatId: number,
    userId: number,
    token: string,
    onMessage: (message: unknown[]) => void
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
          parsedData.forEach(message => onMessage(message)) // Обрабатываем массив сообщений
        } else if (parsedData.content) {
          onMessage(parsedData) // Обрабатываем одно сообщение
        }
        console.log(parsedData)
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
      this.socket.send(JSON.stringify({ content: message, type: 'message' }))
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
