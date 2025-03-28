import { v4 as makeUUID } from 'uuid'
import { EventBus } from './eventBus'
import { TProps, TChildren, TArrayChildren } from '../types/types'
import * as Handlebars from 'handlebars'
import { EVENTS } from '../constants/enums'
import { IEvents } from '../constants/interface'
type TEvents = {
  on: (event: string, callback: (...args: unknown[]) => void) => void
  off: (event: string, callback: (...args: unknown[]) => void) => void
  emit: (event: string, ...args: unknown[]) => void
}
export abstract class Component {
  [x: string]: unknown
  protected _element: HTMLElement | null = null
  protected _meta: { tagName: string; props: TProps }
  private _id: string | null = null
  public children: TChildren
  public arrayChildren: TArrayChildren
  public childProps: TProps & Partial<TEvents>
  eventBus: () => EventBus<IEvents>

  /** JSDoc
   * @param {string} tagName
   * @param {Object} props
   *
   * @returns {void}
   */
  constructor(tagName = 'div', props = {}) {
    const { children, childProps, arrayChildren } = this._getChildren(props)
    const eventBus: EventBus<IEvents> = new EventBus<IEvents>()
    this._id = makeUUID()
    this._meta = {
      tagName,
      props
    }

    this.children = this._makePropsProxy(children) as TChildren
    this.childProps = this._makePropsProxy(childProps)
    this.arrayChildren = this._makePropsProxy(arrayChildren) as TArrayChildren

    this.eventBus = () => eventBus

    this._registerEvents(eventBus)
    eventBus.emit(EVENTS.INIT)
  }

  private _getChildren(propsAndChildren: TProps) {
    const children: TChildren = {}
    const childProps: TProps = {}
    const arrayChildren: TArrayChildren = {}

    Object.entries(propsAndChildren).forEach(([key, value]) => {
      if (value instanceof Component) {
        children[key] = value
      } else if (
        Array.isArray(value) &&
        value.every(item => item instanceof Component)
      ) {
        arrayChildren[key] = value
      } else {
        childProps[key] = value
      }
    })
    return { children, childProps, arrayChildren }
  }

  _registerEvents(eventBus: EventBus<IEvents>) {
    this.registerEvents(eventBus)
    eventBus.on(EVENTS.INIT, this.init.bind(this))
    eventBus.on(EVENTS.FLOW_CDM, this._componentDidMount.bind(this))
    eventBus.on(EVENTS.FLOW_CDU, (oldProps, newProps) =>
      this._componentDidUpdate(oldProps as TProps, newProps as TProps)
    )
    eventBus.on(EVENTS.FLOW_RENDER, this._render.bind(this))
  }

  registerEvents(_eventBus?: EventBus<IEvents>): void {}

  _createResources() {
    const { tagName } = this._meta
    this._element = this._createDocumentElement(tagName)
  }

  init() {
    this._createResources()

    this.eventBus().emit(EVENTS.FLOW_RENDER)
  }

  private _componentDidMount() {
    this.componentDidMount()
  }

  public componentDidMount(_oldProps?: TProps) {}

  public dispatchComponentDidMount() {
    this.eventBus().emit(EVENTS.FLOW_CDM)
  }

  private _componentDidUpdate(oldProps: TProps, newProps: TProps) {
    const response = this.componentDidUpdate(oldProps, newProps)
    if (!response) {
      return
    }
    this._render()
  }

  public componentDidUpdate(_oldProps: TProps, _newProps: TProps): boolean {
    return true
  }

  public getValue(): string | void {}

  public setValue(_text: string): void {}

  public setProps = (nextProps: TProps): void => {
    if (!nextProps) {
      return
    }

    console.log('Setting new props:', nextProps)
    Object.assign(this.childProps, nextProps)
  }

  public get element() {
    return this._element
  }

  private _render(): void {
    const block = this.render()
    this._removeEvents()

    if (this._element) {
      this._element.innerHTML = ''
      if (block instanceof Node) {
        this._element.appendChild(block)
      }
      this._addAttribute()
      this._addEvents()
    }
  }

  public render(): string | DocumentFragment {
    return new DocumentFragment()
  }

  private _addEvents() {
    const { events = {} } = this.childProps

    Object.keys(events).forEach(eventName => {
      if (this._element) {
        this._element.addEventListener(eventName, events[eventName], true)
      }
    })
  }

  private _removeEvents() {
    const { events = {} } = this.childProps

    Object.keys(events).forEach(eventName => {
      this._element!.removeEventListener(eventName, events[eventName])
    })
  }

  public getContent() {
    return this._element
  }

  private _addAttribute() {
    const { attr = {} } = this.childProps
    Object.entries(attr!).forEach(([key, value]) => {
      if (value) {
        if (Array.isArray(value)) {
          this._element?.setAttribute(key, value.join(' '))
        } else {
          this._element?.setAttribute(key, String(value))
        }
      }
    })
  }

  public compile(template: string, props: TProps) {
    const propsAndStubs = { ...props }
    Object.entries(this.children).forEach(([key, child]) => {
      propsAndStubs[key] = new Handlebars.SafeString(
        `<div data-id="${child._id}"></div>`
      )
    })

    Object.entries(this.arrayChildren).forEach(([key, arr]) => {
      arr.forEach(item => {
        propsAndStubs[key] = new Handlebars.SafeString(
          `<div data-id="${key}_${(item as { _id: string })._id}"></div>`
        )
      })
    })

    const fragment = document.createElement('template')
    fragment.innerHTML = Handlebars.compile(template)(propsAndStubs)

    Object.values(this.children).forEach(child => {
      const stub = fragment.content.querySelector(`[data-id="${child._id}"]`)
      const content = child.getContent()

      if (stub && content && stub.parentNode) {
        stub.replaceWith(content as HTMLElement)
      } else if (!stub) {
        console.warn(
          `Stub already replaced or not found for child with id: ${child._id}`
        )
      } else {
        console.error(
          `Stub not found or already replaced for child with id: ${child._id}`
        )
      }
    })

    Object.entries(this.arrayChildren).forEach(([key, arr]) => {
      const listTemplate = this._createDocumentElement(
        'template'
      ) as HTMLTemplateElement

      arr.forEach(item => {
        if (item instanceof Component) {
          const content = item.getContent()
          if (content) {
            listTemplate.content.append(content)
          }
        } else {
          listTemplate.content.append(`${item}`)
        }
        const stub = fragment.content.querySelector(
          `[data-id="${key}_${(item as { _id: string })._id}"]`
        )
        if (stub) {
          stub.replaceWith(listTemplate.content)
        }
      })
    })
    return fragment.content
  }

  private _makePropsProxy(props: TProps): TProps {
    return new Proxy(props, {
      get(target: TProps, prop: string): unknown {
        const value = target[prop]
        return typeof value === 'function' ? value.bind(target) : value
      },
      set: (target: TProps, prop: string, value: unknown): boolean => {
        target[prop] = value

        // Запускаем обновление компоненты
        this.eventBus().emit(EVENTS.FLOW_CDU, { ...target }, target)
        return true
      },
      deleteProperty(): never {
        throw new Error('Нет доступа')
      }
    })
  }

  private _createDocumentElement(tagName: string = 'div') {
    // Можно сделать метод, который через фрагменты в цикле создаёт сразу несколько блоков
    return document.createElement(tagName)
  }

  public show(): void {
    const content = this.getContent()
    if (content) {
      content.style.display = 'block'
    }
  }

  public hide(): void {
    const content = this.getContent()
    if (content) {
      content.style.display = 'none'
    }
  }
}
