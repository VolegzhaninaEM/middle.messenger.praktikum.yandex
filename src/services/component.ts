import { v4 as makeUUID } from "uuid";
import { EventBus } from "./eventBus";
import { TProps, TChildren } from "../types/types";
import Handlebars from "handlebars";

export abstract class Component {
  static readonly EVENTS = {
    INIT: "init",
    FLOW_CDM: "flow:component-did-mount",
    FLOW_CDU: "flow:component-did-update",
    FLOW_RENDER: "flow:render",
  };

  protected _element: HTMLElement | null = null;
  protected _meta: { tagName: string; props: TProps };
  private _id: string | null = null;
  public children: TChildren;
  public childProps: TProps;
  private eventBus: () => EventBus;

  /** JSDoc
   * @param {string} tagName
   * @param {Object} props
   *
   * @returns {void}
   */
  constructor(tagName = "div", props = {}) {
    const { children, childProps } = this._getChildren(props);
    const eventBus: EventBus = new EventBus();
    this._id = makeUUID();
    this._meta = {
      tagName,
      props,
    };

    this.children = this._makePropsProxy(children) as TChildren;

    this.childProps = this._makePropsProxy(childProps);

    this.eventBus = () => eventBus;

    this._registerEvents(eventBus);
    eventBus.emit(Component.EVENTS.INIT);
  }

  private _getChildren(propsAndChildren: TProps) {
    const children: TChildren = {};
    const childProps: TProps = {};

    Object.entries(propsAndChildren).forEach(([key, value]) => {
      if (value instanceof Component) {
        children[key] = value;
      } else {
        childProps[key] = value;
      }
    });
    return { children, childProps };
  }

  _registerEvents(eventBus: EventBus) {
    eventBus.on(Component.EVENTS.INIT, this.init.bind(this));
    eventBus.on(Component.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
    eventBus.on(Component.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
    eventBus.on(Component.EVENTS.FLOW_RENDER, this._render.bind(this));
  }

  _createResources() {
    const { tagName } = this._meta;
    this._element = this._createDocumentElement(tagName);
  }

  init() {
    this._createResources();

    this.eventBus().emit(Component.EVENTS.FLOW_RENDER);
  }

  private _componentDidMount() {
    this.componentDidMount();
  }

  public componentDidMount(_oldProps?: TProps) {}

  public dispatchComponentDidMount() {
    this.eventBus().emit(Component.EVENTS.FLOW_CDM);
  }

  private _componentDidUpdate(oldProps: TProps, newProps: TProps) {
    const response = this.componentDidUpdate(oldProps, newProps);
    if (!response) {
      return;
    }
    this._render();
  }

  public componentDidUpdate(_oldProps: TProps, _newProps: TProps): boolean {
    return true;
  }

  public setProps = (nextProps: TProps): void => {
    if (!nextProps) {
      return;
    }

    Object.assign(this.childProps, nextProps);
  };

  public get element() {
    return this._element;
  }

  private _render(): void {
    const block = this.render();
  
    if (this._element) {
      this._element.innerHTML = '';
      if (block instanceof Node) {
        this._element.appendChild(block);
      }
    }
  }

  public render(): string | DocumentFragment {
    return new DocumentFragment(); ;
  }

  public getContent() {
    return this._element;
  }

  public compile(template: string, props: TProps) {
    const propsAndStubs = { ...props };
    Object.entries(this.children).forEach(([key, child]) => {
      propsAndStubs[key] = new Handlebars.SafeString(
        `<div data-id="${child._id}"></div>`
      );
    });

    const fragment = document.createElement('template');
    fragment.innerHTML = Handlebars.compile(template)(propsAndStubs);

    Object.values(this.children).forEach((child) => {
      const stub = fragment.content.querySelector(`[data-id="${child._id}"]`);
      const content = child.getContent();

      if (stub) stub.replaceWith(content as HTMLElement);
    });
    console.log("Block type:", typeof fragment.content); // Должно быть "string" или "object"
    return fragment.content;
  }

  private _makePropsProxy(props: TProps): TProps {
    // Можно и так передать this
    // Такой способ больше не применяется с приходом ES6+
    const self = this;

    return new Proxy(props, {
      get(target: TProps, prop: string): unknown {
        const value = target[prop];
        return typeof value === "function" ? value.bind(target) : value;
      },
      set(target: TProps, prop: string, value: unknown) {
        target[prop] = value;

        // Запускаем обновление компоненты
        // Плохой cloneDeep, в следующей итерации нужно заставлять добавлять cloneDeep им самим
        self.eventBus().emit(Component.EVENTS.FLOW_CDU, { ...target }, target);
        return true;
      },
      deleteProperty(): never {
        throw new Error("Нет доступа");
      },
    });
  }

  private _createDocumentElement(tagName: string = "div") {
    // Можно сделать метод, который через фрагменты в цикле создаёт сразу несколько блоков
    return document.createElement(tagName);
  }

  public show(): void {
    const content = this.getContent();
    if (content) {
      content.style.display = "block";
    }
  }

  public hide(): void {
    const content = this.getContent();
    if (content) {
      content.style.display = "none";
    }
  }
}
