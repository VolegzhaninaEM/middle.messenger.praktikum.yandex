import { TProps } from '../../types/types'
import { Component } from '../../services/component'
import { default as template } from './actions.hbs?raw'

export class MenuBurgerActions extends Component {
  constructor(tagName: string, props: TProps) {
    super(tagName, props)
  }

  logout() {
    return this.element?.children[1]
  }

  openProfile() {
    return this.element?.children[0]
  }

  render(): DocumentFragment {
    return this.compile(template, this.childProps)
  }
}
