import './avatarLoadModal.less'
import { Component } from '../../services/component'
import { TProps } from '../../types/types'
import { default as template } from './avatarLoadModal.hbs?raw'
import { EVENTS } from '../../constants/enums'
import { EventBus } from '../../services/eventBus'
import { IEvents } from '../../constants/interface'
import { CloseButton, SubmitButton } from '..'
import userApi from '../../api/userApi'
export class AvatarLoadModal extends Component {
  constructor(tagName: string, props: TProps) {
    super(tagName, {
      ...props,
      attr: { class: 'avatar__load' },
      title: 'Upload photo',
      events: {
        ...props.events,
        change: () => this._handleFileSelect.bind(this)
      }
    })

    if (!this.children.closeButton) {
      this.children.closeButton = new CloseButton('div', {
        events: {
          click: this.close.bind(this)
        }
      })
    }

    if (!this.children.saveButton) {
      this.children.saveButton = new SubmitButton('input', {
        attr: {
          value: String('Done'),
          class: 'save-btn'
        },
        events: {
          click: async () => await this.handleSubmit()
        }
      })
    }

    this.element
      ?.getElementsByClassName('upload-text')[0]
      .addEventListener('click', this.openFileDialog.bind(this))
  }

  registerEvents(eventBus: EventBus<IEvents>) {
    eventBus.on(EVENTS.MODAL_OPEN, this.open.bind(this))
    eventBus.on(EVENTS.FILE_SELECT, (file: unknown) =>
      this._handleFileUpload(file as File)
    )
  }

  handleFile() {
    const reader = new FileReader()
    const file = this.childProps.file as any
    this.setProps({ reader })
    reader.readAsDataURL(file.name)
  }

  async handleSubmit() {
    const file: File = this.childProps.file as File
    const reader: FileReader = this.childProps.reader as FileReader

    reader.onload = async () => {
      const url = URL.createObjectURL(file)
      this.setProps({ url })
      const formData = new FormData()
      this.eventBus().emit(EVENTS.FILE_SELECT, url)
      formData.append('avatar', file) // Добавляем файл в FormData

      await userApi.changeAvatar(formData)
      if (this.childProps.events) {
        this.childProps.events.close()
      }
    }
    reader.readAsDataURL(file)
  }

  public open() {
    const app = document.getElementById('app')
    if (app) {
      app.appendChild(this.getContent() as Node)
    }
  }

  public close() {
    // Логика закрытия модального окна
    this.getContent()?.remove()
  }

  public openFileDialog() {
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.accept = 'image/*'
    fileInput.style.display = 'hidden'
    fileInput.addEventListener('change', this._handleFileSelect.bind(this))

    // Добавляем инпут в DOM (временно)
    document.body.appendChild(fileInput)

    // Открываем диалог выбора файла
    fileInput.click()

    // Удаляем инпут после использования
    fileInput.remove()
  }

  private _handleFileSelect(e: Event) {
    e.preventDefault()
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file && this.eventBus()) {
      // Отправляем событие о выборе файла
      this.eventBus().emit(EVENTS.FILE_SELECT, file)
    }
  }

  private async _handleFileUpload(file: File) {
    // Обработка загруженного файла
    console.log('Selected file:', file.name)
    const reader = new FileReader()
    this.setProps({ reader })
    this.setProps({ file, title: file.name })

    if (!file) {
      alert('Пожалуйста, выберите файл.')
      return
    }
  }

  render() {
    return this.compile(template, {
      ...this.childProps
    })
  }
}
