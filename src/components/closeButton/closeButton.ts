import { default as template } from './closeButton.hbs?raw'
import { Component } from '../../services/component'
import { TProps } from '../../types/types'

export class CloseButton extends Component {
  constructor(tagName: string, props: TProps) {
    super(tagName, props)
  }

  render(): DocumentFragment {
    return this.compile(template, this.childProps)
  }
}
