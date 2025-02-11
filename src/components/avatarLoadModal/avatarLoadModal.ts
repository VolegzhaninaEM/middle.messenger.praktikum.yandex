import './avatarLoadModal.less'
import { Component } from '../../services/component'
import { TProps } from '../../types/types'
import { default as template } from './avatarLoadModal.hbs?raw'
import { EVENTS } from '../../constants/enums'
import { EventBus } from '../../services/eventBus'
import { IEvents } from '../../constants/interface'

type TAvatarModal = TProps & {
  fileInput?: HTMLInputElement
}
export class AvatarLoadModal extends Component {
  private fileInput: HTMLInputElement
  constructor(tagName: string, props: TAvatarModal) {
    super(tagName, {
      ...props,
      attr: { class: 'avatar__load' },
      events: {
        click: () => this.openFileDialog(),
        change: () => this._handleFileSelect.bind(this)
      }
    })

    this.fileInput = document.createElement('input')
    this.fileInput.type = 'file'
    this.fileInput.accept = 'image/*'
    this.fileInput.style.display = 'none'
    this.fileInput.addEventListener('change', this._handleFileSelect.bind(this))
  }

  registerEvents(eventBus: EventBus<IEvents>) {
    eventBus.on(EVENTS.FILE_SELECT, (file: unknown) =>
      this._handleFileUpload(file as File)
    )
  }

  private _handleFileUpload(file: File) {
    // Обработка загруженного файла
    console.log('Selected file:', file.name)
    // Здесь можно добавить превью изображения
  }

  public open() {
    const app = document.getElementById('app')
    if (app) {
      app.appendChild(this.getContent() as Node)
    }
  }

  public close() {
    this.getContent()?.remove()
  }

  public openFileDialog() {
    this.fileInput.click()
  }

  private _handleFileSelect(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file && this.eventBus()) {
      // Отправляем событие о выборе файла
      this.eventBus().emit(EVENTS.FILE_SELECT, file)
      this.close()
    }
  }

  render() {
    return this.compile(template, {
      ...this.childProps,
      events: {
        handleClick: () => this.openFileDialog()
      }
    })
  }
}
