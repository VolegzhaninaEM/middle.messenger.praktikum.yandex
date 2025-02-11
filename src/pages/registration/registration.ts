import { Component } from '../../services/component'
import { default as template } from './registration.hbs?raw'
import { TData, TProps } from '../../types/types'
import { validateForm } from '../../utils/validators'
import {
  EmailInput,
  InputErrorCapture,
  PhoneInput,
  SignForm,
  SubmitButton,
  TextInput
} from '../../components'

type TRegistration = TProps & {
  title: string
}

export class RegistrationPage extends Component {
  constructor(tagName: string, props: TRegistration) {
    super(tagName, props)

    this.children.email = new EmailInput('input', {
      attr: { placeholder: 'Email', name: 'email' }
    })

    this.children.login = new TextInput('input', {
      attr: { placeholder: 'Login', name: 'login' }
    })

    this.children.firstName = new TextInput('input', {
      attr: { placeholder: 'First Name', name: 'first_name' }
    })

    this.children.secondName = new TextInput('input', {
      attr: { placeholder: 'Second Name', name: 'second_name' }
    })

    this.children.phone = new PhoneInput('input', {
      attr: { placeholder: 'Phone', name: 'phone' }
    })

    this.children.password = new TextInput('input', {
      attr: { placeholder: 'Password', name: 'password' }
    })

    if (!this.children.error) {
      this.children.error = new InputErrorCapture('div', {
        attr: {
          class: 'input__error'
        }
      })
    }

    this.children.submitButton = new SubmitButton('input', {
      attr: {
        value: String('SIGN UP'),
        class: 'submitButton'
      },
      events: {
        click: (event: unknown) => this.handleSubmit(event as Event, this),
        blur: (event: unknown) => this.handleBlur(event as FocusEvent, this)
      }
    })

    if (!this.children.form) {
      this.children.form = new SignForm('main', {
        title: 'Sign Up',
        content: [
          this.children.email,
          this.children.login,
          this.children.firstName,
          this.children.secondName,
          this.children.phone,
          this.children.password,
          this.children.submitButton,
          this.children.error
        ]
      })
    }
  }

  getValues(context: Component) {
    const values = []
    const fieldsValues = {}
    values.push(
      { email: context.children.email.getValue() },
      { login: context.children.login.getValue() },
      { firstName: context.children.firstName.getValue() },
      { secondName: context.children.secondName.getValue() },
      { password: context.children.password.getValue() },
      { phone: context.children.phone.getValue() }
    )

    values.forEach(item => {
      Object.assign(fieldsValues, item)
    })

    console.log({ values: fieldsValues })

    return fieldsValues
  }

  validateRegistration(context: Component) {
    const data = this.getValues(context)
    const errors = validateForm(data as TData)
    if (errors) {
      const errorMessages = Object.values(errors).join('. ')
      this.children.error.setProps({
        errorMessage: errorMessages // Обновляем состояние
      })
      console.error(errors)
    }
  }

  handleSubmit(event: Event, context: Component) {
    event.preventDefault()
    this.validateRegistration(context)
  }

  handleBlur(event: FocusEvent, context: Component) {
    event.preventDefault()
    this.validateRegistration(context)
  }

  render(): DocumentFragment {
    return this.compile(template, this.childProps)
  }
}
