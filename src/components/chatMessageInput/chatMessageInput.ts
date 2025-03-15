import './chatMessageInput.less'
import { Component } from '../../services/component'
import { TElementForm, TProps } from '../../types/types'
import store from '../../utils/store'

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

    store.set('inputMessage', (this.element as HTMLInputElement).value)
  }

  getValue() {
    store.set('inputMessage', (this.element as HTMLInputElement).value)
    return (this.element as HTMLInputElement).value
  }

  setValue(text: string) {
    (this.element as HTMLInputElement).value = text
    store.set('inputMessage', text)
  }

  render() {
    return this.compile('', this.childProps)
  }
}
