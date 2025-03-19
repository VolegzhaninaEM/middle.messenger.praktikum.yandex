import authApi from './api/authApi'
import { routes } from './config/routes'
import { ROUTES } from './constants/enums'
import Router from './router/router'
import store from './utils/store'

async function checkAuth(): Promise<boolean> {
  try {
    const response = await authApi.fetchUser()

    if (response.status === 200) {
      store.set('user', { ...response.response }) // Сохраняем данные пользователя в store
      return true // Пользователь авторизован
    }

    return false // Пользователь не авторизован
  } catch (error) {
    console.error('Ошибка при проверке авторизации:', error)
    return false
  }
}
a = 444

;(async () => {
  const isAuthenticated = await checkAuth()

  if (isAuthenticated) {
    Router.go(ROUTES.CHATS)
  } else {
    if (window.location.pathname) {
      Router.go(ROUTES.SIGN_UP)
    } else {
      Router.go(ROUTES.LOGIN)
    }
  }

  // Определяем маршруты
  routes.forEach(route => {
    Router.use(route.path, route.component)
  })

  Router.start() // Запускаем маршрутизатор
})()
