import './signForm.less'
import { default as template } from './signForm.hbs?raw'
import { Component } from '../../services/component'
import { TProps } from '../../types/types'

type TSignForm = TProps & {
  content: Array<Component>
}

export class SignForm extends Component {
  constructor(tagName: string, props: TSignForm) {
    const { content } = props
    super(tagName, {
      ...props,
      attr: { class: 'container__sign' }
    })

    if (!this.arrayChildren.content) {
      this.arrayChildren.content = content.map(component => {
        return component
      })
    }
  }

  render() {
    return this.compile(template, this.childProps)
  }
}
