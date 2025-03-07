import './chatPreview.less'
import { default as ChatPreviewTemplate } from './chatPreview.hbs?raw'
import { Avatar } from '../../../../components/avatar/avatar'
import { TChatPreview, TProps } from '../../../../types/types'
import { Component } from '../../../../services/component'

type Props = TProps & TChatPreview

export default class ChatPreview extends Component {
  constructor(tagName: string, props: Props) {
    super(tagName, {
      ...props,
      attr: {
        class: ['chat', 'chats__item']
      }
    })

    if (!this.children.avatar) {
      this.children.avatar = new Avatar('div', {
        attr: { class: 'profile-photo_m' },
        url: props.avatar || '' ,
      })
    }
  }

  render() {
    return this.compile(ChatPreviewTemplate, this.childProps)
  }
}
