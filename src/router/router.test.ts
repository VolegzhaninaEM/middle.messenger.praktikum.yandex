import { describe, it, expect, beforeEach, afterEach } from '@jest/globals'
import Router from './router'
import { Component } from '@/services/component'

class MockBlock extends Component {
  constructor() {
    super('div', { props: {} })
  }

  render() {
    return new DocumentFragment()
  }
}

describe('Router', () => {
  let router: typeof Router

  beforeEach(() => {
    router = Router

    window.testCtx = {
      /**
       * Позволяет задавать свойства `window.location` в тестах.
       * @param {String} prop - Свойство location, которое нужно изменить.
       * @param {String} val - Значение свойства.
       */
      location: function (prop, val) {
        if (prop === 'pathname') {
          Object.defineProperty(window.location, 'pathname', {
            writable: true,
            value: val
          })
        } else {
          throw new Error(`Property '${prop}' is not supported for mocking`)
        }
      }
    }
    // Очищаем состояние перед каждым тестом
    ;(router as any).routes = []
    ;(router as any)._currentRoute = null

    const mockComponent = new MockBlock()
    router.use('/', mockComponent)
    router.use('/new-path', mockComponent)
    // Устанавливаем обработчик onpopstate
    window.onpopstate = jest.fn()
  })

  afterEach(() => {
    // Очищаем моки после каждого теста
    jest.clearAllMocks()
    ;(window.testCtx.location as any).pathname = '/'
  })

  describe('use()', () => {
    it('Проверяем добавление путей', () => {
      const mockComponent: Component = new MockBlock()
      const pathname = '/test'

      router.use(pathname, mockComponent)

      const routes = (router as any).routes
      expect(routes[0]).toBeDefined()
      expect(routes.length).toBe(3)
    })
  })

  describe('start()', () => {
    it('Должен звать _onRoute с текущим путем', () => {
      const mockOnRoute = jest.spyOn(router as any, '_onRoute')
      const initialPathname = '/'
      ;(window.testCtx.location as any).pathname = initialPathname

      router.start()

      expect(mockOnRoute).toHaveBeenCalledWith(initialPathname)
    })

    it('Должен звать _onRoute когда срабатывает событие popstate', () => {
      const mockOnRoute = jest.spyOn(router as any, '_onRoute')
      router.start()

      const newPathname = '/new-path'
      window.history.pushState({}, '', newPathname)

      const popStateEvent = new PopStateEvent('popstate', {
        bubbles: true,
        cancelable: true
      })
      window.dispatchEvent(popStateEvent)

      expect(mockOnRoute).toHaveBeenCalledWith(newPathname)
    })
  })

  describe('go()', () => {
    it('Должен изменять историю через pushState и вызывать _onRoute', () => {
      const mockPushState = jest.spyOn(window.history, 'pushState')
      const mockOnRoute = jest.spyOn(router as any, '_onRoute')

      const newPathname = '/new-path'

      router.go(newPathname)

      expect(mockPushState).toHaveBeenCalledWith({}, '', newPathname)
      expect(mockOnRoute).toHaveBeenCalledWith(newPathname)
    })
  })

  describe('back()', () => {
    it('Должен вызвать history.back', () => {
      const mockBack = jest.spyOn(window.history, 'back')

      router.back()

      expect(mockBack).toHaveBeenCalled()
      expect(mockBack).toHaveBeenCalledTimes(1)
    })
  })

  describe('forward()', () => {
    it('Должен вызвать history.forward', () => {
      const mockBack = jest.spyOn(window.history, 'forward')

      router.forward()

      expect(mockBack).toHaveBeenCalled()
      expect(mockBack).toHaveBeenCalledTimes(1)
    })
  })
})
