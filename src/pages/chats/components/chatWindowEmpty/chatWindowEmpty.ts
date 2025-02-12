import { Component } from '../../../../services/component'
import { TProps } from '../../../../types/types'

export class EmptyChat extends Component {
  constructor(tagName: string, props: TProps) {
    super(tagName, {
      ...props,
      attr: {
        ...props.attr,
        class: 'chat__empty'
      }
    })
  }

  render(): DocumentFragment {
    return this.compile('{{title}}', this.childProps)
  }
}
