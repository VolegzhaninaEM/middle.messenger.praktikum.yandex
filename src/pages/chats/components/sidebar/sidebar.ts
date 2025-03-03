import { Profile } from '../../..'
import {
  ChatName,
  DropdownIcon,
  ToggleIcon,
  ToggleActions
} from '../../../../components'
import authController from '../../../../controllers/authController'
import { Component } from '../../../../services/component'
import { TProps, TUser } from '../../../../types/types'
import { ChatList } from '../chatList/chatList'
import { Search } from '../search/search'
import { default as template } from './sidebar.hbs?raw'

export class Sidebar extends Component {
  constructor(tagName: string, props: TProps) {
    super(tagName, props)

    const dropdownMenu: Component[] = [
      new ToggleActions('li', {
        href: '/profile',
        title: 'Profile',
        events: {
          click: (event: unknown) => this.openModal(event as Event)
        }
      }),
      new ToggleActions('li', {
        href: '/logout',
        title: 'Log Out',
        events: {
          click: (event: unknown) => this.logout(event as Event)
        }
      })
    ]

    if (!this.children.menuButton) {
      const dropdown = new ToggleIcon('div', {
        attr: { class: 'menu' },
        src: '/burger-icon.png',
        events: {
          click: (event: unknown) => this.toggleMenu(event as ToggleEvent, this)
        },
        actions: [...dropdownMenu]
      })

      this.children.menuButton = dropdown
    }

    if (!this.children.searchForm) {
      this.children.searchForm = new Search('form', {
        attr: { class: 'search' }
      })
    }

    if (!this.children.chatList) {
      this.children.chatList = new ChatList('div', {
        attr: { class: 'chat__list' }
      })
    }

    if (!this.children.buttonIcon) {
      this.children.buttonIcon = new DropdownIcon('button', {
        url: './plus-icon.png',
        events: {
          click: (event: unknown) => this.createChat(event as Event)
        }
      })
    }
  }

  public async openModal(event: Event) {
    event.preventDefault()
    const data: TUser = await authController.fetchUser()
    const profileModal = new Profile('div', {
      href: '/profile',
      attr: { class: 'chat__overlay', data }
    })
    const app = document.getElementById('app')
    if (app) {
      app.appendChild(profileModal.getContent() as Node)
    }
  }

  public async createChat(event: Event) {
    event.preventDefault()
    const createChatModal = new ChatName('div', {
      title: 'Create Chat',
      attr: { class: 'chat__overlay' }
    })
    this.open(createChatModal)
  }

  public open(content: Component) {
    const app = document.getElementById('app')
    if (app) {
      app.appendChild(content.getContent() as Node)
    }
  }

  initActions() {
    const dropdownMenu = this.children.dropdownMenu as ToggleActions

    const logout = dropdownMenu.logout()
    const openProfile = dropdownMenu.openProfile()
    if (logout) {
      logout.addEventListener('click', this.logout)
    }

    if (openProfile) {
      openProfile.addEventListener('click', this.openModal)
    }
  }

  public toggleMenu(event: ToggleEvent, context: Component) {
    event.preventDefault()
    context.children.menuButton.toggleMenu()
  }

  public logout(event: Event) {
    event.preventDefault()
    authController.logout()
  }

  render(): DocumentFragment {
    return this.compile(template, this.childProps)
  }
}
