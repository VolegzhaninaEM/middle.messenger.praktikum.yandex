import { Button } from '../../../../components'
import { StoreEvents } from '../../../../constants/enums'
import chatController from '../../../../controllers/chatController'
import { Component } from '../../../../services/component'
import { TChatsData, TProps } from '../../../../types/types'
import { connect } from '../../../../utils/connect'
import store from '../../../../utils/store'
import ChatPreview from '../chatPreview/chatPreview'
import { default as template } from './chatList.hbs?raw'

class ChatList extends Component {
  currentOffset = 0
  readonly limit = 5
  private visibleChatsLimit = 5 // Лимит видимых чатов
  constructor(tagName: string, props: TProps) {
    super(tagName, props)

    // Подписываемся на изменения состояния store
    store.on(StoreEvents.Updated, () => {
      this.updateChatList(store.getState().chats as TChatsData[])
    })

    // Инициализация начального списка чатов
    this.updateChatList(store.getState().chats as TChatsData[])

    // Включаем подгрузку при скролле
    this.enableScrollLoading()

    if (!this.children.showMoreButton) {
      this.children.showMoreButton = new Button('input', {
        attr: {
          value: String('Show more'),
          class: 'show-more-button'
        },
        events: {
          click: () => this.increaseVisibleChatsLimit()
        }
      })
    }

    this.setProps({
      showMoreButton: this.children.showMoreButton
    })
  }

  selectChat(event: Event, chatId: number): void {
    event.preventDefault()
    this.selectedChatId = chatId

    console.log('Выбранный чат:', chatId)

    // Уведомляем родительский компонент о выборе чата
    if (
      this.childProps.events &&
      typeof this.childProps.events.onChatSelect === 'function'
    ) {
      ;(this.childProps.events.onChatSelect as (chatId: number) => void)(chatId)
    }
  }

  public enableScrollLoading() {
    window.addEventListener('scroll', () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 10
      ) {
        this.loadMoreChats()
      }
    })
  }

  public async loadMoreChats() {
    this.currentOffset += this.limit
    const newChats =
      (await chatController.getChats({
        offset: this.currentOffset,
        limit: this.limit
      })) || []

    if (newChats.length < this.limit && this.children.showMoreButton) {
      // Скрываем кнопку
      this.children.showMoreButton.setProps({
        attr: { style: 'display: none;' }
      })
    }
  }

  public increaseVisibleChatsLimit() {
    this.visibleChatsLimit += 5 // Увеличиваем лимит на 5
    this.loadMoreChats()
    this.updateChatList(store.getState().chats as TChatsData[]) // Перерисовываем список
  }

  updateChatList(chatsData: TChatsData[]) {
    // Применяем ограничение на количество видимых чатов
    const limitedChats = chatsData.slice(0, this.visibleChatsLimit)

    console.log('Limited chats:', limitedChats) // Логирование для проверки

    // Создаем новые дочерние элементы
    this.arrayChildren.chatList = limitedChats.map((chat: TChatsData) => {
      return new ChatPreview('div', {
        ...chat,
        attr: { class: 'chat__list' },
        events: {
          click: (event: unknown) =>
            this.selectChat(event as Event, chat.id as number)
        }
      })
    })

    // Перерисовываем компонент
    this.setProps({ chats: limitedChats })
  }

  render(): DocumentFragment {
    return this.compile(template, {
      ...this.childProps,
      children: this.children
    })
  }
}

const withChats = connect(state => ({
  chats: state.chats
}))
export default withChats(ChatList)
