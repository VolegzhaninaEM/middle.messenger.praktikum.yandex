import './chatMessageInput.less'
import { Component } from '../../services/component'
import { TElementForm, TProps } from '../../types/types'

type TMessage = TProps & TElementForm

// Компонент строки отправки сообщения
export class ChatMessageInput extends Component {
  constructor(tagName: string, props: TMessage) {
    const { attr } = props
    super(tagName, {
      ...props,
      attr: {
        ...attr,
        class: 'message__input',
        type: 'text'
      }
    })
  }

  getValue() {
    return (this.element as HTMLInputElement).value
  }

  render() {
    return this.compile('', this.childProps)
  }
}
