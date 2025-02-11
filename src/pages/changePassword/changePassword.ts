import { Component } from '../../services/component'
import { default as template } from './changePassword.hbs?raw'
import { TData, TProps } from '../../types/types'
import { validateForm } from '../../utils/validators'
import {
  CloseButton,
  InputErrorCapture,
  SubmitButton,
  TextInput
} from '../../components'

export class PasswordChagePage extends Component {
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

    this.children.oldPassword = new TextInput('input', {
      attr: {
        placeholder: 'Old Password',
        name: 'oldPassword',
        type: 'password'
      }
    })

    this.children.newPassword = new TextInput('input', {
      attr: {
        placeholder: 'New Password',
        name: 'newPassword',
        type: 'password'
      }
    })

    this.children.newPasswordControl = new TextInput('input', {
      attr: {
        placeholder: 'New Password Control',
        name: 'newPasswordControl',
        type: 'password'
      }
    })

    if (!this.children.saveButton) {
      this.children.saveButton = new SubmitButton('input', {
        attr: {
          value: String('Save changes'),
          class: 'save-btn'
        },
        events: {
          click: (event: unknown) => this.handleSubmit(event as Event, this),
          blur: (event: unknown) => this.handleBlur(event as FocusEvent, this)
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
      { oldPassword: context.children.oldPassword.getValue() },
      { newPassword: context.children.newPassword.getValue() },
      { newPasswordControl: context.children.newPasswordControl.getValue() }
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

  handleSubmit(event: Event, context: Component) {
    event.preventDefault()
    this.validateProfile(context)
  }

  handleBlur(event: FocusEvent, context: Component) {
    event.preventDefault()
    this.validateProfile(context)
  }

  render(): DocumentFragment {
    return this.compile(template, this.childProps)
  }
}
