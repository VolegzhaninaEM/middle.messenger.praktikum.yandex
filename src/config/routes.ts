import { ROUTES } from '../constants/enums'
import {
  ChatPage,
  ErrorPage,
  LoginPage,
  PasswordChagePage,
  Profile,
  RegistrationPage
} from '../pages'
import { TRoute } from '../types/types'

export const routes: Array<TRoute> = [
  {
    path: ROUTES.LOGIN,
    component: new LoginPage()
  },
  {
    path: ROUTES.SIGN_UP,
    component: new RegistrationPage()
  },
  {
    path: ROUTES.CHATS,
    component: new ChatPage()
  },
  {
    path: ROUTES.PROFILE_SETTINGS,
    component: new Profile()
  },
  {
    path: ROUTES.PASSWORD_CONTROLS,
    component: new PasswordChagePage()
  },
  {
    path: ROUTES.ERROR,
    component: new ErrorPage()
  }
]
