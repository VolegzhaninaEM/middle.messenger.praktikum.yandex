import { PasswordChagePage, Profile } from '../../..'
import {
  ChatName,
  DropdownIcon,
  ToggleIcon,
  ToggleActions
} from '../../../../components'
import authController from '../../../../controllers/authController'
import chatController from '../../../../controllers/chatController'
import userController from '../../../../controllers/userController'
import { Component } from '../../../../services/component'
import { TProps, TUser } from '../../../../types/types'
import store from '../../../../utils/store'
import { default as ChatList } from '../chatList/chatList'
import { Search } from '../search/search'
import { default as template } from './sidebar.hbs?raw'

export class Sidebar extends Component {
  constructor(tagName: string, props: TProps) {
    super(tagName, props)

    this.setProps({ data: store.getState().user as TUser })

    const dropdownMenu: Component[] = [
      new ToggleActions('li', {
        href: '/profile',
        title: 'Profile',
        events: {
          click: (event: unknown) => this.openModal(event as Event)
        }
      }),

      new ToggleActions('li', {
        href: '/password',
        title: 'Change password',
        events: {
          click: (event: unknown) => this.openPasswordModal(event as Event)
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

      this.children.searchForm
        .getContent()
        ?.addEventListener('submit', event => {
          event.preventDefault() // Отменяем стандартное поведение формы

          const inputElement = this.children.searchForm
            .getContent()
            ?.getElementsByClassName(
              'search__input'
            )[0] as HTMLInputElement | null
          if (inputElement) {
            const value = inputElement.value.trim()
            if (value) {
              this.performSearch({
                login: value
              }) // Вызываем функцию поиска
            } else {
              alert('Введите текст для поиска')
            }
          }
        })
    }

    if (!this.children.chatList) {
      this.children.chatList = new ChatList('div', {
        chats: [],
        events: {
          onChatSelect: (chatId: number) => this.openChat(chatId)
        }
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

    this.children.newChatModal = new ChatName('div', {
      title: 'Create Chat',
      placeholder: 'Chat Name',
      buttonName: 'Create chat',
      attr: { class: 'chat__overlay' },
      events: {
        onClick: (event: unknown) => this.handleSubmitNewChat(event as Event)
      }
    })
  }

  public async openModal(event: Event) {
    event.preventDefault()
    const profileModal = new Profile('div', {
      href: '/profile',
      attr: { class: 'chat__overlay', data: this.childProps.data }
    })
    this.open(profileModal)
  }

  public async openPasswordModal(event: Event) {
    event.preventDefault()
    const passwordModal = new PasswordChagePage('div', {
      href: '/password',
      attr: { class: 'chat__overlay', data: this.childProps.data as TUser }
    })
    this.open(passwordModal)
  }

  public async performSearch(data: { login: string }): Promise<void> {
    try {
      const results = await userController.searchUserByLogin(data) // Вызов контроллера
      console.log('Результаты поиска:', results)
      displayResults(results) // Отображаем результаты
    } catch (error) {
      console.error('Ошибка при поиске:', error)
      alert('Произошла ошибка при поиске')
    }
  }

  public async createChat(event: Event) {
    event.preventDefault()
    this.open(this.children.newChatModal)
  }


  public openChat(chatId: number): void {
    // передаем дальше по цепочке родителю
    if (
      this.childProps.events &&
      typeof this.childProps.events.onChatSelect === 'function'
    ) {
      (this.childProps.events.onChatSelect as (chatId: number) => void)(chatId)
    }
  }

  async handleSubmitNewChat(event: Event) {
    event.preventDefault()
    const title = this.children.newChatModal.children.chatName.getValue()
    await chatController.createChat({ title }).then(async response => {
      if (response.id) {
        this.children.newChatModal.getContent()?.remove()
        const chatsData = await chatController.getChats({})
        store.set('chats', chatsData)
      }
    })
  }

  public open(content: Component) {
    const app = document.getElementById('app')
    if (app) {
      app.appendChild(content.getContent() as Node)
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

  destroy(): void {
    if (this.element) {
      this.element.remove(); // Удаляем элемент из DOM
    }
  }

  render(): DocumentFragment {
    return this.compile(template, this.childProps)
  }
}

function displayResults(results: any[]): void {
  const resultsContainer = document.getElementById('search-results')
  if (!resultsContainer) return

  // Очищаем предыдущие результаты
  resultsContainer.innerHTML = ''

  // Добавляем новые результаты
  results.forEach(result => {
    const resultItem = document.createElement('div')
    resultItem.textContent =
      result.name || result.title || JSON.stringify(result)
    resultsContainer.appendChild(resultItem)
  })
}
