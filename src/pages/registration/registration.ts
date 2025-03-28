import { Component } from '../../services/component'
import { default as template } from './registration.hbs?raw'
import { TData, TProps, TSignUpData } from '../../types/types'
import { validateForm } from '../../utils/validators'
import {
  EmailInput,
  InputErrorCapture,
  PhoneInput,
  SignForm,
  SubmitButton,
  TextInput
} from '../../components'
import { connect } from '../../utils/connect'
import authController from '../../controllers/authController'
import { USER_INFO } from '../../constants/enums'

type TRegistration = TProps & {
  title: string
}

class RegistrationPage extends Component {
  constructor(tagName: string, props: TRegistration) {
    super(tagName, props)

    this.children.email = new EmailInput('input', {
      attr: { placeholder: 'Email', name: 'email', type: 'text' },
      events: {
        blur: () => this.validateRegistration(this)
      }
    })

    this.children.login = new TextInput('input', {
      attr: { placeholder: 'Login', name: 'login', type: 'text' },
      events: {
        blur: () => this.validateRegistration(this)
      }
    })

    this.children.firstName = new TextInput('input', {
      attr: { placeholder: 'First Name', name: 'first_name', type: 'text' },
      events: {
        blur: () => this.validateRegistration(this)
      }
    })

    this.children.secondName = new TextInput('input', {
      attr: { placeholder: 'Second Name', name: 'second_name', type: 'text' },
      events: {
        blur: () => this.validateRegistration(this)
      }
    })

    this.children.phone = new PhoneInput('input', {
      attr: { placeholder: 'Phone', name: 'phone' },
      events: {
        blur: () => this.validateRegistration(this)
      }
    })

    this.children.password = new TextInput('input', {
      attr: { placeholder: 'Password', name: 'password' },
      events: {
        blur: () => this.validateRegistration(this)
      }
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
        click: (event: unknown) => this.handleSubmit(event as Event, this)
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
      { [USER_INFO.email]: context.children.email.getValue() },
      { [USER_INFO.login]: context.children.login.getValue() },
      { [USER_INFO.first_name]: context.children.firstName.getValue() },
      { [USER_INFO.second_name]: context.children.secondName.getValue() },
      { [USER_INFO.password]: context.children.password.getValue() },
      { [USER_INFO.phone]: context.children.phone.getValue() }
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
    const data = this.getValues(context)
    authController.signUp(data as TSignUpData)
  }

  render(): DocumentFragment {
    return this.compile(template, this.childProps)
  }
}

const withUser = connect(state => ({ user: state.user }))
export default withUser(RegistrationPage)
