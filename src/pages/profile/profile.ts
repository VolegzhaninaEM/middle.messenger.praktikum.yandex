import './profile.less'
import { Component } from '../../services/component'
import { default as template } from './profile.hbs?raw'
import { TData, TProps, TUser } from '../../types/types'
import { validateForm } from '../../utils/validators'
import {
  Avatar,
  AvatarLoadModal,
  CloseButton,
  EmailInput,
  InputErrorCapture,
  PhoneInput,
  SubmitButton,
  TextInput
} from '../../components'
import { connect } from '../../utils/connect'
import userController from '../../controllers/userController'
import { USER_INFO } from '../../constants/enums'

class Profile extends Component {
  constructor(tagName: string, props: TProps) {
    super(tagName, { ...props, hasErrors: false, error: '' })

    const { data = {} as TUser } = props.attr || {}

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
        url: data?.avatar || '',
        needOverlay: true,
        events: {
          click: this._handleAvatarClick.bind(this)
        }
      })
    }

    this.uploadModal = new AvatarLoadModal('main', {
      events: {
        close: () => this.closeUploadModal()
      }
    })

    if (!this.children.login) {
      this.children.login = new TextInput('input', {
        attr: {
          placeholder: 'Login',
          name: 'login',
          type: 'text',
          value: data?.login || ''
        },
        events: {
          blur: () => this.validateProfile(this)
        }
      })
    }

    if (!this.children.firstName) {
      this.children.firstName = new TextInput('input', {
        attr: {
          placeholder: 'First Name',
          name: 'first_name',
          type: 'text',
          value: data?.first_name || ''
        },
        events: {
          blur: () => this.validateProfile(this)
        }
      })
    }

    if (!this.children.secondName) {
      this.children.secondName = new TextInput('input', {
        attr: {
          placeholder: 'Second Name',
          name: 'second_name',
          type: 'text',
          value: data?.second_name || ''
        },
        events: {
          blur: () => this.validateProfile(this)
        }
      })
    }

    if (!this.children.email) {
      this.children.email = new EmailInput('input', {
        attr: {
          placeholder: 'Email account',
          name: 'email',
          value: data?.email || ''
        },
        events: {
          blur: () => this.validateProfile(this)
        }
      })
    }

    if (!this.children.phone) {
      this.children.phone = new PhoneInput('input', {
        attr: {
          placeholder: 'Mobile number',
          name: 'phone',
          value: data?.phone || ''
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

  public closeUploadModal() {
    // Логика закрытия модального окна
    (this.uploadModal as AvatarLoadModal).getContent()?.remove()
    this.children.profilePhoto.setProps({
      url: (this.uploadModal as AvatarLoadModal).childProps.url
    })
  }

  private _handleAvatarClick() {
    (this.uploadModal as AvatarLoadModal).open()
  }

  getValues(context: Component) {
    const values = []
    const fieldsValues = {}
    values.push(
      { [USER_INFO.login]: context.children.login.getValue() },
      { [USER_INFO.first_name]: context.children.firstName.getValue() },
      { [USER_INFO.second_name]: context.children.secondName.getValue() },
      { [USER_INFO.email]: context.children.email.getValue() },
      { [USER_INFO.phone]: context.children.phone.getValue() }
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
    const data = this.getValues(context)
    userController.submitChanges(data as TUser).then(response => {
      if (response === 200) {
        this.getContent()?.remove()
      }
    })
  }

  render(): DocumentFragment {
    return this.compile(template, this.childProps)
  }
}

const withUser = connect(state => ({ user: state.user }))
export default withUser(Profile)
