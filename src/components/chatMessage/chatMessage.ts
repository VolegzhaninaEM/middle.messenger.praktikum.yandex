import './chatMessage.less'
import { Component } from '../../services/component'
import { TProps } from '../../types/types'
import { default as template } from './chatMessage.hbs?raw'

// Компонент строки отправки сообщения
export class ChatMessage extends Component {
  constructor(tagName: string, props: TProps) {
    super(tagName, props)
  }

  render() {
    return this.compile(template, this.childProps)
  }
}
