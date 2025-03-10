import {
  Avatar,
  ChatName,
  ToggleActions,
  ToggleIcon
} from '../../../../components'
import chatController from '../../../../controllers/chatController'
import { Component } from '../../../../services/component'
import { TProps, TUser } from '../../../../types/types'
import store from '../../../../utils/store'
import { default as template } from './chatHeader.hbs?raw'
import './chatHeader.less'

export class ChatHeader extends Component {
  constructor(tagName: string, props: TProps) {
    super(tagName, { ...props })

    if (!this.children.sender) {
      this.children.sender = new Avatar('div', {
        attr: { class: 'chat__header_avatar' }
      })
    }

    if (!this.children.buttonIcon) {
      const dropdownMenu: ToggleActions[] = [
        new ToggleActions('li', {
          href: '/profile',
          title: 'Add user',
          events: {
            click: (event: unknown) =>
              this.openAddOrRemoveModal(event as Event, true)
          }
        }),
        new ToggleActions('li', {
          href: '/logout',
          title: 'Remove user',
          events: {
            click: (event: unknown) =>
              this.openAddOrRemoveModal(event as Event, false)
          }
        })
      ]

      const dropdown = new ToggleIcon('div', {
        attr: { class: 'menu' },
        src: './dot-icon.png',
        events: {
          click: (event: unknown) => this.toggleMenu(event as ToggleEvent, this)
        },
        actions: [...dropdownMenu]
      })

      this.children.buttonIcon = dropdown
    }

    if (!this.children.addUserModal) {
      this.children.addUserModal = new ChatName('div', {
        title: 'Add user',
        placeholder: 'User Login',
        buttonName: 'Add user',
        attr: { class: 'chat__overlay' },
        events: {
          onClick: (e: unknown) => this.handleSubmitAdd(e as PointerEvent)
        }
      })
    }

    if (!this.children.removeUserModal) {
      this.children.removeUserModal = new ChatName('div', {
        title: 'Remove user',
        placeholder: 'User Login',
        buttonName: 'Remove user',
        attr: { class: 'chat__overlay' },
        events: {
          onClick: (e: unknown) => this.handleSubmitRemove(e as PointerEvent)
        }
      })
    }
  }

  public async openAddOrRemoveModal(event: Event, isAdd: boolean) {
    event.preventDefault()
    if (isAdd) {
      this.open(this.children.addUserModal)
    } else {
      this.open(this.children.removeUserModal)
    }
  }

  async handleSubmitAdd(event: Event) {
    event.preventDefault()
    const component: Component = this.children.addUserModal.children.chatName
    const login = component.getValue() as string
    console.log('handleSubmitAdd', { login, chatId: this.childProps.chatId })
    await chatController.addUser({
      login,
      chatId: this.childProps.chatId as number
    })
    this.children.addUserModal.getContent()?.remove()
  }

  async handleSubmitRemove(event: Event) {
    event.preventDefault()
    const chatId = (store.getState().user as TUser ).id
    const login =
      this.children.addUserModal.children.chatName.getValue() as string
    console.log('handleSubmitAdd', { login, chatId })
    await chatController.removeUser({ login, chatId })
    this.children.addUserModal.getContent()?.remove()
  }

  public open(content: Component) {
    const app = document.getElementById('app')
    if (app) {
      app.appendChild(content.getContent() as Node)
    }
  }

  public toggleMenu(_event: ToggleEvent, context: Component) {
    ;(context.children.buttonIcon as ToggleIcon).toggleMenu()
  }

  render(): DocumentFragment {
    return this.compile(template, this.childProps)
  }
}
