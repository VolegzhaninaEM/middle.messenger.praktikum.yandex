import { describe, it, expect, beforeEach } from '@jest/globals'
import { Component } from './component'
import { EVENTS } from '@/constants/enums'

describe('Component', () => {
  let component: Component

  class MockComponent extends Component {
    render() {
      return new DocumentFragment()
    }
  }

  beforeEach(() => {
    // Создаем экземпляр компонента перед каждым тестом
    component = new MockComponent('div', {})
  })

  describe('constructor()', () => {
    it('Должен инициализировать компонент с уникальным ID', () => {
      expect(component['_id']).toBeDefined()
      expect(typeof component['_id']).toBe('string')
    })

    it('Должен разделить props на children, arrayChildren и childProps', () => {
      const mockChild = new MockComponent('span', {})
      const mockArrayChild = [new MockComponent('span', {})]

      const props = {
        text: 'Hello',
        child: mockChild,
        array: mockArrayChild
      }

      const componentWithProps = new MockComponent('div', props)

      expect(componentWithProps.children).toHaveProperty('child', mockChild)
      expect(componentWithProps.arrayChildren).toHaveProperty('array', mockArrayChild)
      expect(componentWithProps.childProps).toHaveProperty('text', 'Hello')
    })
  })

  describe('setProps()', () => {
    it('Должен обновлять свойства', () => {
        component.setProps({ newText: 'Updated' })
    
        // Проверяем, что свойства обновились
        expect(component.childProps).toHaveProperty('newText', 'Updated')
      })
  })

  describe('show() and hide()', () => {
    it('Должен показывать и скрывать элемент', () => {
      const content = component.getContent() as HTMLElement

      component.hide()
      expect(content.style.display).toBe('none')

      component.show()
      expect(content.style.display).toBe('block')
    })
  })

  describe('compile()', () => {
    it('Должен корректно компилировать шаблон с дочерними компонентами', () => {
      const mockChild = new MockComponent('span', {})
      const mockArrayChild = [new MockComponent('span', {})]

      const props = {
        child: mockChild,
        array: mockArrayChild
      }

      const componentWithProps = new MockComponent('div', props)

      const template = `
        <div>
          {{ child }}
          {{ array }}
        </div>
      `

      const fragment = componentWithProps.compile(template, props)

      // Проверяем, что stubs заменены на реальные элементы
      const childStub = fragment.querySelector(`[data-id="${mockChild['_id']}"]`)
      const arrayStub = fragment.querySelector(
        `[data-id="array_${mockArrayChild[0]['_id']}"]`
      )

      expect(childStub).toBeNull() // Stub должен быть заменён
      expect(arrayStub).toBeNull() // Stub должен быть заменён
    })
  })

  describe('Жизненный цикл', () => {
    it('Должен вызывать componentDidMount после INIT', () => {
      const mockComponentDidMount = jest.spyOn(component, 'componentDidMount')

      component.eventBus().emit(EVENTS.FLOW_CDM)

      expect(mockComponentDidMount).toHaveBeenCalled()
    })

    it('Должен вызывать componentDidUpdate при изменении props', () => {
      const mockComponentDidUpdate = jest.spyOn(component, 'componentDidUpdate')

      component.setProps({ newText: 'Updated' })

      expect(mockComponentDidUpdate).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Object)
      )
    })
  })
})
