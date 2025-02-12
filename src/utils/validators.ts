import { TData } from '../types/types'

enum validateFields {
  firstName = 'first_name',
  secondName = 'second_name',
  displayName = 'display_name',
  email = 'email',
  login = 'login',
  phone = 'phone',
  password = 'password',
  passwordCheck = 'passwordCheck',
  oldPassword = 'oldPassword',
  newPassword = 'newPassword',
  newPasswordControl = 'newPasswordControl',
  message = 'message'
}

type TError = Partial<Record<validateFields, string>>

export function validateForm(formData: TData) {
  const errors: TError = {}

  // Проверка login
  if (validateFields.login in formData) {
    const loginRegex = /^(?!\d+$)[a-zA-Z0-9-_]{3,20}$/
    if (!loginRegex.test(formData.login)) {
      errors.login =
        'Логин должен быть от 3 до 20 символов, латиница, может содержать цифры, но не состоять из них, без пробелов, допускаются дефис и нижнее подчёркивание'
    }
  }

  // Проверка email
  if (validateFields.email in formData) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(formData.email)) {
      errors.email = 'Некорректный email'
    }
  }

  // Проверка first_name
  if (validateFields.firstName in formData) {
    const nameRegex = /^[A-ZА-ЯЁ][a-zа-яё-]*$/
    if (!nameRegex.test(formData.first_name)) {
      errors.first_name =
        'Имя должно начинаться с заглавной буквы, содержать только латиницу или кириллицу, без пробелов, цифр и спецсимволов (кроме дефиса)'
    }
  }
  //Проверка second_name
  if (validateFields.secondName in formData) {
    const nameRegex = /^[A-ZА-ЯЁ][a-zа-яё-]*$/
    if (!nameRegex.test(formData.second_name)) {
      errors.second_name =
        'Фамилия должна начинаться с заглавной буквы, содержать только латиницу или кириллицу, без пробелов, цифр и спецсимволов (кроме дефиса)'
    }
  }

  // Проверка password, oldPassword, newPassword, newPasswordControl, passwordCheck
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,40}$/
  const passwordErrorMessage =
    'Пароль должен содержать от 8 до 40 символов, хотя бы одну заглавную букву и цифру'
  if (validateFields.password in formData) {
    if (!passwordRegex.test(formData.password)) {
      errors.password = passwordErrorMessage
    }
  }
  if (validateFields.oldPassword in formData) {
    if (!passwordRegex.test(formData.oldPassword)) {
      errors.oldPassword = passwordErrorMessage
    }
  }
  if (validateFields.newPassword in formData) {
    if (!passwordRegex.test(formData.newPassword)) {
      errors.newPassword = passwordErrorMessage
    }
  }
  if (validateFields.newPasswordControl in formData) {
    if (!passwordRegex.test(formData.newPasswordControl)) {
      errors.newPasswordControl = passwordErrorMessage
    }
  }
  if (validateFields.passwordCheck in formData) {
    if (!passwordRegex.test(formData.passwordCheck)) {
      errors.passwordCheck = passwordErrorMessage
    }
  }

  // Проверка phone
  if (validateFields.phone in formData) {
    const phoneRegex = /^\+?\d{10,15}$/
    if (!phoneRegex.test(formData.phone)) {
      errors.phone =
        'Телефон должен содержать от 10 до 15 цифр и может начинаться с плюса'
    }
  }

  // Проверка message
  if (validateFields.message in formData) {
    if (!formData.message || formData.message.trim() === '') {
      errors.message = 'Сообщение не должно быть пустым'
    }
  }

  return Object.keys(errors).length === 0 ? undefined : errors
}
