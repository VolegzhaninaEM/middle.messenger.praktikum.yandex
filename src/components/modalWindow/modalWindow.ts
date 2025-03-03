import { default as ModalTemplate } from './modalWindow.hbs?raw'
import { Component } from '../../services/component'
import { TButton, TProps } from '../../types/types'
import { CloseButton } from '../closeButton/closeButton'
import { SubmitButton } from '..'

type Props = TProps & {
  title: string
  button: TButton
  content: Array<Component> | Component
  fileLoadedName?: string
  error?: string
  onClick: (e: unknown) => void
  onClose?: (e: unknown) => void
}
export class Modal extends Component {
  constructor(tagName: string, props: Props) {
    const { content } = props
    super(tagName, props)

    this.hide()

    if (!this.children.closeButton) {
        this.children.closeButton = new CloseButton('div', {
            events: {
              click: () => {
                // Логика закрытия модального окна
                const app = document.getElementById('app')
                if (app) {
                  app.removeChild(this.getContent() as Node)
                }
              }
            }
          })
    }

    if (!this.lists.content) {
      if (content instanceof Array) {
        this.lists.content = content.map(component => {
          return component
        })
      }
    }

    if (!this.children.content) {
      if (content instanceof Component) {
        this.children.content = content
      }
    }

    if (!this.children.saveButton) {
          this.children.saveButton = new SubmitButton('input', {
            attr: {
              value: String('Save changes'),
              class: 'save-btn'
            },
            events: {
              click: (event: unknown) => this.handleSubmit(event as Event, this)
            }
          })
        }
  }

  toggle() {
    if (this.getContent()?.style.display === 'none') {
      this.show()
      return
    }
    this.hide()
  }

  render() {
    return this.compile(ModalTemplate, this.props)
  }
}
