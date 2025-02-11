import { routes } from '../config/routes'

const app = document.getElementById('app')

function renderPage(PageComponent: any) {
  if (app) {
    const page = new PageComponent()
    app.replaceChildren(page.getContent())
    page.dispatchComponentDidMount()
    bindNavLinks()

    return app
  }
}

function bindNavLinks() {
  const links = document.querySelectorAll('.nav-link')
  links.forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault()
      const path = link.getAttribute('href') || '/'
      navigateTo(path)
    })
  })
}

export function navigateTo(path: string) {
  if (routes[path]) {
    history.pushState({}, '', path)
    renderPage(routes[path])
  } else {
    // Обработка 404
    if (app) {
      renderPage(routes['*'])
    }
  }
}

// Обработка навигации по истории
window.onpopstate = () => {
  const path = window.location.pathname
  navigateTo(path)
}

// Инициализация роутера
export function initRouter() {
  const path = window.location.pathname
  navigateTo(path)
}
