export enum EVENTS {
  INIT = 'init',
  FLOW_CDM = 'flow:component-did-mount',
  FLOW_CDU = 'flow:component-did-update',
  FLOW_RENDER = 'flow:render',
  FILE_SELECT = 'file:select', // Новое событие: выбор файла
  MODAL_OPEN = 'modal:open', // Новое событие: открытие модального окна
  MODAL_CLOSE = 'modal:close'
}

export enum StoreEvents {
  Updated = 'updated'
}

export enum USER_INFO {
  login = 'login',
  password = 'password',
  id = 'id',
  first_name = 'first_name',
  second_name = 'second_name',
  display_name = 'display_name',
  phone = 'phone',
  avatar = 'avatar',
  email = 'email'
}

export enum PASSWORD {
  newPassword = 'newPassword',
  oldPassword = 'oldPassword'
}

export enum ROUTES {
  LOGIN = '/',
  CHATS = '/messenger',
  PROFILE_SETTINGS = '/settings',
  SIGN_UP = '/signup',
  PASSWORD_CONTROLS = '/password-control',
  ERROR = '*'
}
