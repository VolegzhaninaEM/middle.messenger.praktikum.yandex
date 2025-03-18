// Расширяем глобальный объект Window
interface Window {
  testCtx: {
    /**
     * Позволяет задавать свойства `window.location` в тестах.
     * @param {string} prop - Свойство location, которое нужно изменить (например, 'pathname', 'href').
     * @param {string} val - Значение свойства.
     */
    location: (prop: string, val: string) => void
  }
}
