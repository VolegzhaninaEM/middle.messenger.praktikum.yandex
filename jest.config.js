// jest.config.js
export default {
  preset: 'ts-jest', // Используем ts-jest для TypeScript
  testEnvironment: 'jsdom', // Для тестирования DOM-элементов
  setupFilesAfterEnv: ['./jest.setup.ts'], // Настройка глобальных переменных или утилит
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // Поддержка псевдонимов
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy' // Игнорируем стили
  },
  testMatch: ['**/*.test.[jt]s?(x)'] // Где искать тесты
}
