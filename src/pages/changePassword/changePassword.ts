import { Component } from '../../services/component'
import { default as template } from './changePassword.hbs?raw'
import { TData, TPassword, TProps } from '../../types/types'
import { validateForm } from '../../utils/validators'
import {
  CloseButton,
  InputErrorCapture,
  SubmitButton,
  TextInput
} from '../../components'
import userController from '../../controllers/userController'

export class PasswordChagePage extends Component {
  constructor(tagName: string = 'div', props: TProps = {}) {
    super(tagName, { ...props, hasErrors: false, error: '' })

    if (!this.children.closeButton) {
      this.children.closeButton = new CloseButton('div', {
        events: {
          click: () => this.close()
        }
      })
    }

    this.children.oldPassword = new TextInput('input', {
      attr: {
        placeholder: 'Old Password',
        name: 'oldPassword',
        type: 'password'
      },
      events: {
        blur: () => this.validatePassword(this)
      }
    })

    this.children.newPassword = new TextInput('input', {
      attr: {
        placeholder: 'New Password',
        name: 'newPassword',
        type: 'password'
      },
      events: {
        blur: () => this.validatePassword(this)
      }
    })

    

    if (!this.children.saveButton) {
      this.children.saveButton = new SubmitButton('input', {
        attr: {
          value: String('Save changes'),
          class: 'save-btn'
        },
        events: {
          click: (event: unknown) => this.handleSubmit(event as Event, this)
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
    )

    values.forEach(item => {
      Object.assign(fieldsValues, item)
    })

    console.log({ values: fieldsValues })

    return fieldsValues
  }

  validatePassword(context: Component) {
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

  async handleSubmit(event: Event, context: Component) {
    event.preventDefault()
    const data = this.getValues(context) as TPassword
    this.validatePassword(context)
    await userController.changePassword(data)
    this.close()
    
  }

  close() {
      this.getContent()?.remove()
  }

  render(): DocumentFragment {
    return this.compile(template, this.childProps)
  }
}
