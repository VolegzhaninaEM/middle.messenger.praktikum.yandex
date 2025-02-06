import { routes } from "../config/routes";

const app = document.getElementById("app");

function renderPage(PageComponent: any) {
  if (app) {
    const page = new PageComponent();
    console.log("Page instance:", page); // Что это за объект?
    console.log("Page content:", page.getContent()); // Если есть метод для получения DOM

    bindNavLinks();
    app.replaceChildren(page.getContent());
    page.dispatchComponentDidMount();

    return app;
  }
}

function bindNavLinks() {
  const links = document.querySelectorAll(".nav-link");
  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const path = link.getAttribute("href") || "/";
      navigateTo(path);
    });
  });
}

export function navigateTo(path: string) {
  if (routes[path]) {
    history.pushState({}, "", path);
    renderPage(routes[path]);
  } else {
    // Обработка 404
    if (app) {
      app.innerHTML = `
                <div class="page">
                    <h1>404</h1>
                    <p>Страница не найдена.</p>
                    <a href="/" class="nav-link">Вернуться на главную</a>
                </div>
            `;
      bindNavLinks();
    }
  }
}

// Обработка навигации по истории
window.onpopstate = () => {
  const path = window.location.pathname;
  navigateTo(path);
};

// Инициализация роутера
export function initRouter() {
  const path = window.location.pathname;
  navigateTo(path);
}
