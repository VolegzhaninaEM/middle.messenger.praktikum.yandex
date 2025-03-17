import { Component } from '../../services/component'
import { TProps } from '../../types/types'

export class Button extends Component {
  constructor(tagName: string, props: TProps) {
    super(tagName, props)
  }

  render(): DocumentFragment {
    return this.compile('', this.childProps)
  }
}
