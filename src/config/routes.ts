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
  '/': LoginPage,
  '/nav': NavigationPage,
  '/messenger': ChatPage,
  '/settings': Profile,
  '/sign-up': RegistrationPage,
  '/password-control': PasswordChagePage,
  '*': Error
}
