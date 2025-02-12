import {
  ChatPage,
  Error,
  LoginPage,
  NavigationPage,
  PasswordChagePage,
  Profile,
  RegistrationPage
} from '../pages'

export const routes: Record<string, any> = {
  '/': NavigationPage,
  '/chats': ChatPage,
  '/profile': Profile,
  '/login': LoginPage,
  '/registration': RegistrationPage,
  '/password-control': PasswordChagePage,
  '*': Error
}
