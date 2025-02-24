import { routes } from './config/routes'
import Router from './router/router'

routes.map(route => {
    Router.use(route.path, route.component)
  })
Router.start()
