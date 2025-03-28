import { Component } from '../../services/component'
import { default as template } from './login.hbs?raw'
import { TData, TProps, TSignInData } from '../../types/types'
import { validateForm } from '../../utils/validators'
import {
  InputErrorCapture,
  SignForm,
  SubmitButton,
  TextInput
} from '../../components'
import { connect } from '../../utils/connect'
import authController from '../../controllers/authController'

type TLogin = TProps & {
  title: string
}

class LoginPage extends Component {
  constructor(tagName: string, props: TLogin) {
    super(tagName, { ...props, hasErrors: false })

    this.children.login = new TextInput('input', {
      attr: { placeholder: 'Login', name: 'login', type: 'text' },
      events: {
        blur: () => this.validateLogin(this)
      }
    })

    this.children.password = new TextInput('input', {
      attr: { placeholder: 'Password', name: 'password', type: 'text' },
      events: {
        blur: () => this.validateLogin(this)
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
        value: String('SIGN IN'),
        class: 'submitButton'
      },
      events: {
        click: (event: unknown) => this.handleSubmit(event as Event, this)
      }
    })

    if (!this.children.form) {
      this.children.form = new SignForm('main', {
        title: 'Sign In',
        content: [
          this.children.login,
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
      { login: context.children.login.getValue() },
      { password: context.children.password.getValue() }
    )

    values.forEach(item => {
      Object.assign(fieldsValues, item)
    })

    console.log({ values: fieldsValues })

    return fieldsValues
  }

  validateLogin(context: Component) {
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

  async handleSubmit(event: Event, context: Component) {
    event.preventDefault()
    this.validateLogin(context)
    const data = this.getValues(context)
    authController.signIn(data as TSignInData)
  }

  render(): DocumentFragment {
    return this.compile(template, this.childProps)
  }
}

const withUser = connect(state => ({ user: state.user }))
export default withUser(LoginPage)
