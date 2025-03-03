import './createChat.less'
import { Component } from '../../services/component'
import { default as template } from './createChat.hbs?raw'
import { TData, TProps } from '../../types/types'
import { validateForm } from '../../utils/validators'
import {
  CloseButton,
  InputErrorCapture,
  SubmitButton,
  TextInput
} from '../../components'
import chatController from '../../controllers/chatController'

export class ChatName extends Component {
  constructor(tagName: string, props: TProps) {
    super(tagName, { ...props, hasErrors: false, error: '' })

    if (!this.children.closeButton) {
      this.children.closeButton = new CloseButton('div', {
        events: {
          click: () => {
            // Логика закрытия модального окна
            const app = document.getElementById('app')
            if (app) {
              app.removeChild(this.getContent() as Node)
            }
          }
        }
      })
    }

    if (!this.children.chatName) {
      this.children.chatName = new TextInput('input', {
        attr: {
          placeholder: 'Chat Name',
          name: 'chat-name',
          type: 'text',
          value: ''
        },
        events: {
          blur: () => this.validateProfile(this)
        }
      })
    }

    if (!this.children.saveButton) {
      this.children.saveButton = new SubmitButton('input', {
        attr: {
          value: String('Save changes'),
          class: 'save-btn'
        },
        events: {
          click: (event: unknown) => this.handleSubmit(event as Event)
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
  }

  getValues(context: Component) {
    const values = []
    const fieldsValues = {}
    values.push(
      { 'name': context.children.chatName.getValue() },
    )

    values.forEach(item => {
      Object.assign(fieldsValues, item)
    })

    console.log({ values: fieldsValues })

    return fieldsValues
  }

  validateProfile(context: Component) {
    const data = this.getValues(context)
    const errors = validateForm(data as TData)
    if (errors) {
      const errorMessages = Object.values(errors).join('. ')
      this.setProps({
        hasErrors: true
      })
      this.children.error.setProps({
        errorMessage: errorMessages // Обновляем состояние
      })
      console.error(errors)
    }
  }

  async handleSubmit(event: Event) {
    event.preventDefault()
    const title = this.children.chatName.getValue()
    await chatController.createChat({title}).then(response => {
      if (response.id) {
        this.getContent()?.remove()
        chatController.getChats({})
      }
    })
  }

  render(): DocumentFragment {
    return this.compile(template, this.childProps)
  }
}
