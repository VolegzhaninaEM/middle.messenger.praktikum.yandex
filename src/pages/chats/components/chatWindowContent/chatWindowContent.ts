import './chatWindowContent.less'
import { default as ChatWindowContentTemplate } from './chatWindowContent.hbs?raw'
import { TMessage, TProps } from '../../../../types/types'
import { Component } from '../../../../services/component'
import { ChatMessage } from '../../../../components'

const message1: TMessage = {
  text: 'Привет! Смотри, тут всплыл интересный кусок лунной космической истории — НАСА в какой-то момент попросила Хассельблад адаптировать модель SWC для полетов на Луну. Сейчас мы все знаем что астронавты летали с моделью 500 EL — и к слову говоря, все тушки этих камер все еще находятся на поверхности Луны, так как астронавты с собой забрали только кассеты с пленкой.Хассельблад в итоге адаптировал SWC для космоса, но что-то пошло не так и на ракету они так никогда и не попали. Всего их было произведено 25 штук, одну из них недавно продали на аукционе за 45000 евро.',
  type: 'incoming',
  time: '12:30',
  status: 'sent',
  sender: {
    firstName: 'Lucy',
    lastName: ''
  }
}
const message2: TMessage = {
  text: 'Круто!',
  time: '12:31',
  status: 'seen',
  type: 'outcoming',
  sender: {
    firstName: 'Mike',
    lastName: 'Henderson'
  }
}
const messages = [message1, message2]

type Props = TProps & {
  messages?: Array<TMessage>
}
export default class ChatWindowContent extends Component {
  constructor(tagName: string, props: Props) {
    super(tagName, {
      ...props,
      attributes: { class: 'chat-window-content-dialogs' },
      messages: messages
    })

    if (!this.lists.chatMessageList) {
      this.lists.chatMessageList = messages.map((message: TMessage) => {
        return new ChatMessage('div', { message })
      })
    }
  }

  render() {
    return this.compile(ChatWindowContentTemplate, this.props)
  }
}
