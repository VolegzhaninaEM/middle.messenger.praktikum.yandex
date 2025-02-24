import { Profile } from '../../..'
import { MenuBurger, MenuBurgerActions } from '../../../../components'
import authController from '../../../../controllers/authController'
import { Component } from '../../../../services/component'
import { TProps } from '../../../../types/types'
import { ChatList } from '../chatList/chatList'
import { Search } from '../search/search'
import { default as template } from './sidebar.hbs?raw'

export class Sidebar extends Component {
  constructor(tagName: string, props: TProps) {
    super(tagName, props)

    this.children.dropdownMenu = new MenuBurgerActions('div', {})

    if (!this.children.menuButton) {
      const dropdown = new MenuBurger('div', {
        attr: { class: 'menu' },
        events: {
          click: (event: unknown) => this.toggleMenu(event as ToggleEvent, this)
        },
        actions: [this.children.dropdownMenu]
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

    this.initActions()
  }

  public openModal(event: Event) {
    event.preventDefault()
    const profileModal = new Profile('div', {
      href: '/profile',
      attr: { class: 'chat__overlay' }
    })
    const app = document.getElementById('app')
    if (app) {
      app.appendChild(profileModal.getContent() as Node)
    }
  }

  initActions() {
    const dropdownMenu = this.children.dropdownMenu as MenuBurgerActions

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
