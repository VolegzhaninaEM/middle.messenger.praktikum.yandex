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

interface IFooter {
  hasErrors: boolean
  error: string
}
export class ChatFooter extends Component implements IFooter {
  error: string = ''
  hasErrors: boolean = false
  constructor(tagName: string, props: TProps) {
    super(tagName, {
      ...props,
      attr: { class: 'chat__footer' },
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

  getMessage(context: Component) {
    return {
      message: (context.children.inputMessage as ChatMessageInput).getValue()
    }
  }

  async handleClick(event: SubmitEvent, context: Component) {
    event.preventDefault()
    this._handleError(context)
    try {
      const message = this.childProps.message as string
      ;(this.childProps.socket as ChatWebSocket).sendMessage(
        JSON.stringify({
          content: message,
          type: 'message'
        })
      )

      console.log('Сообщение отправлено:', message)

      // Очищаем поле ввода после успешной отправки
      const input = this.element?.querySelector(
        '.message-input'
      ) as HTMLInputElement | null
      if (input) {
        input.value = ''
      }
    } catch (error) {
      console.error('Ошибка при отправке сообщения:', error)
      alert('Не удалось отправить сообщение')
    }
  }

  private _handleError(context: Component) {
    const data = this.getMessage(context)
    const errors = validateForm(data as TInputMessage)
    if (errors) {
      this.hasErrors = true
      this.setProps({
        hasErrors: true
      })

      this.children.error.setProps({
        errorMessage: errors.message // Обновляем состояние
      })
    } else {
      this.hasErrors = false
      this.setProps({
        hasErrors: false,
        message: data
      })
      console.log(data)
    }
  }

  render() {
    return this.compile(template, {
      ...this.childProps,
      hasErrors: this.hasErrors,
      error: this.error
    })
  }
}
