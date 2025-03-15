import './toggleIcon.less'
import { TProps } from '../../types/types'
import { Component } from '../../services/component'
import { default as template } from './toggleIcon.hbs?raw'

interface IDropdownMenu {
  toggleMenu: () => void
  isOpen: boolean
}

type TDropdownMenu = TProps & {
  actions: Array<Component>
}
export class ToggleIcon extends Component implements IDropdownMenu {
  isOpen: boolean = false
  constructor(tagName: string, props: TDropdownMenu) {
    const { actions } = props
    super(tagName, props)

    if (!this.arrayChildren.actions) {
      this.arrayChildren.actions = actions.map(component => {
        return component
      })
    }
  }

  public toggleMenu() {
    this.isOpen = !this.isOpen
    if (this._element) {
      this._element.remove()
    }

    // Рендерим новый контент и добавляем его в DOM вручную
    const newContent = this.render()
    if (this._element) {
      this._element.appendChild(newContent)
    }
  }

  render(): DocumentFragment {
    return this.compile(template, { ...this.childProps, isOpen: this.isOpen })
  }
}
