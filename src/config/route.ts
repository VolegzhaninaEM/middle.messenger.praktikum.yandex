import { Component } from '../services/component'
import { TProps } from '../types/types'
import { isEqual } from '../utils/helpers'
import { render } from '../utils/renderDOM'

export class Route {
  private _block: Component | null
  private _props: TProps
  private _pathname: string
  private _blockClass: Component

  constructor(pathname: string, view: Component, props: TProps) {
    this._pathname = pathname
    this._blockClass = view
    this._block = null
    this._props = props
  }

  navigate(pathname: string) {
    if (this.match(pathname)) {
      this._pathname = pathname
      this.render()
    }
  }

  leave() {
    if (this._block) {
      this._block.hide()
    }
  }

  match(pathname: unknown) {
    return isEqual(pathname, this._pathname)
  }

  render() {
    if (!this._block) {
      this._block = this._blockClass
      render(this._props.rootQuery as string, this._block as Component)
      return
    }

    this._block.show()
  }
}
