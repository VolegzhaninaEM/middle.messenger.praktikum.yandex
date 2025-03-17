import './chatFooter.less'
import { Component } from '../../../../services/component'
import { TInputMessage, TProps } from '../../../../types/types'
import { validateForm } from '../../../../utils/validators'
import { default as template } from './chatFooter.hbs?raw'
import {
  ChatMessageInput,
  InputErrorCapture,
  SendIcon
} from '../../../../components'
import { ChatWebSocket } from '../../../../webSocket/webSocket'
import store from '../../../../utils/store'

interface IFooter {
  hasErrors: boolean
  error: string
}

type TChatWindowProps = TProps & {
  socket?: ChatWebSocket // Указываем тип для socket
}
export class ChatFooter extends Component implements IFooter {
  error: string = ''
  hasErrors: boolean = false
  constructor(tagName: string, props: TChatWindowProps) {
    super(tagName, {
      ...props,
      attr: { class: 'chat__footer' },
      events: {
        ...props.events,
        keydown: (event: unknown) => this.handleKeyDown(event as KeyboardEvent)
      },
      hasErrors: false,
      error: ''
    })

    if (!this.children.inputMessage) {
      this.children.inputMessage = new ChatMessageInput('input', {
        name: 'message',
        placeholder: 'Сообщение',
        attr: {
          class: 'message__input'
        },
        events: {
          blur: () => this._handleError(this)
        }
      })
    }

    if (!this.children.error) {
      this.children.error = new InputErrorCapture('div', {
        attr: {
          class: 'input__error'
        }
      })
    }

    if (!this.children.sendButton) {
      this.children.sendButton = new SendIcon('button', {
        attr: {
          class: 'arrow__button'
        },
        events: {
          click: (event: unknown) =>
            this.handleClick(event as SubmitEvent, this)
        }
      })
    }
  }

  componentDidUpdate(oldProps: TProps, newProps: TProps) {
    return oldProps !== newProps
  }

  getMessage(context: Component) {
    return (context.children.inputMessage as ChatMessageInput).getValue()
  }

  async handleClick(event: SubmitEvent | KeyboardEvent, context: Component) {
    event.preventDefault()
    try {
      const newMessage = this.getMessage(context)
      store.set('inputMessage', newMessage)
      const message = newMessage as string
      ;(this.childProps.socket as ChatWebSocket).sendMessage(message)

      this._handleError(context)
      console.log('Сообщение отправлено:', message)
      // Очищаем поле ввода после успешной отправки
      if (this.children.inputMessage) {
        ;(context.children.inputMessage as ChatMessageInput).setValue('')
      }
    } catch (error) {
      console.error('Ошибка при отправке сообщения:', error)
      alert('Не удалось отправить сообщение')
    }
  }

  private _handleError(context: Component) {
    const data = this.getMessage(context)
    const errors = validateForm({ message: data } as TInputMessage)
    if (errors) {
      this.hasErrors = true

      this.children.error.setProps({
        errorMessage: errors.message // Обновляем состояние
      })
    } else {
      this.hasErrors = false
      console.log(data)
    }
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      // Если нажата клавиша Enter, отправляем сообщение
      this.handleClick(event, this)
    }
  }

  render() {
    return this.compile(template, this.childProps)
  }
}
