import {
  CloseButton,
  Avatar,
  AvatarLoadModal,
  TextInput,
  EmailInput,
  PhoneInput,
  SubmitButton,
  InputErrorCapture
} from '../../../../components'
import { Component } from '../../../../services/component'
import { TProps, TData } from '../../../../types/types'
import { connect } from '../../../../utils/connect'
import { validateForm } from '../../../../utils/validators'
import { default as template } from './profileEdit.hbs?raw'

class Profile extends Component {
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

    if (!this.children.profilePhoto) {
      this.children.profilePhoto = new Avatar('div', {
        attr: { class: 'profile-photo' },
        events: {
          click: this._handleAvatarClick.bind(this)
        }
      })
    }

    this.uploadModal = new AvatarLoadModal('main', {})

    if (!this.children.login) {
      this.children.login = new TextInput('input', {
        attr: { placeholder: 'Login', name: 'login', type: 'text' },
        events: {
          blur: () => this.validateProfile(this)
        }
      })
    }

    if (!this.children.firstName) {
      this.children.firstName = new TextInput('input', {
        attr: { placeholder: 'First Name', name: 'first_name', type: 'text' },
        events: {
          blur: () => this.validateProfile(this)
        }
      })
    }

    if (!this.children.secondName) {
      this.children.secondName = new TextInput('input', {
        attr: { placeholder: 'Second Name', name: 'second_name', type: 'text' },
        events: {
          blur: () => this.validateProfile(this)
        }
      })
    }

    if (!this.children.email) {
      this.children.email = new EmailInput('input', {
        attr: { placeholder: 'Email account', name: 'email' },
        events: {
          blur: () => this.validateProfile(this)
        }
      })
    }

    if (!this.children.phone) {
      this.children.phone = new PhoneInput('input', {
        attr: { placeholder: 'Mobile number', name: 'phone' },
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

  private _handleAvatarClick() {
    ;(this.uploadModal as AvatarLoadModal).open()
  }

  getValues(context: Component) {
    const values = []
    const fieldsValues = {}
    values.push(
      { login: context.children.login.getValue() },
      { firstName: context.children.firstName.getValue() },
      { secondName: context.children.secondName.getValue() },
      { email: context.children.email.getValue() },
      { phone: context.children.phone.getValue() }
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

  render(): DocumentFragment {
    return this.compile(template, this.childProps)
  }
}

const withUser = connect(state => ({ user: state.user }))
export default withUser(Profile)
