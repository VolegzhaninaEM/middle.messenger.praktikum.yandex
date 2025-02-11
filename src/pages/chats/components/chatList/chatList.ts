import { Component } from '../../../../services/component'
import { TProps } from '../../../../types/types'
import { default as template } from './chatList.hbs?raw'

export class ChatList extends Component {
  constructor(tagName: string, props: TProps) {
    super(tagName, props)
  }

  render(): DocumentFragment {
    return this.compile(template, this.childProps)
  }
}
