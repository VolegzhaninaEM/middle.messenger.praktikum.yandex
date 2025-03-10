## Описание
Проект мессенджера

## Установка
- `npm install` — установка зависимостей,
- `npm build` — сборка версии мессенджера,
- `npm start` - запуск стенда

### **Прототип сайта**
https://www.figma.com/design/MGBswdf5BpbZGyTpqFVT4I/sprint_1?node-id=0-1&p=f&t=6eDxxbqHnKzR49K9-0

### **Домен в Netlify**
https://sprint1-volegzhanina.netlify.app/
Авторизация - https://sprint1-volegzhanina.netlify.app/pages/signs/signin
Регистрация - https://sprint1-volegzhanina.netlify.app/pages/signs/signup
Страница чатов - https://sprint1-volegzhanina.netlify.app/pages/chats/chats
Ошибка 404 - https://sprint1-volegzhanina.netlify.app/pages/errors/404
Ошибка 5хх - https://sprint1-volegzhanina.netlify.app/pages/errors/5xx

## Sprint 2
- Внедрен компонентный подход, создан базовый компонент Component и настроено взаимодействие EventBus
- Добавлен ESLint
- Добавлен Stylelint
- Добавлены валидации для всех страниц
- Добавлен класс HTTPTransport для работы с запросами
- Настроен вывод ошибок как в консоль, так и дружелюбных ошибок для пользователя
- Данные собранные по введенным полям выводятся в console.log()


## Sprint 3
- Внедрены HTTP API чатов, авторизации и пользователей
- Подключены WebSocket для работы с real-time сообщениями
- Добавлена проверка авторизации и редирект
