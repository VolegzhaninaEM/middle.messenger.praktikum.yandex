import { Component } from '../../services/component'
import { TProps, TAttributesInput } from '../../types/types'

type TPropsText = TProps & TAttributesInput
export class TextInput extends Component {
  constructor(tagName: string, props: TPropsText) {
    super(tagName, {
      ...props,
      attr: {
        ...props.attr,
        class: 'input-field',
        value: props.attr.value || ''
      }
    })
  }

  setValue(text: string) {
    ;(this.element as HTMLInputElement).value = text
  }

  getValue() {
    return (this.element as HTMLInputElement).value
  }

  render(): DocumentFragment {
    return this.compile('', this.childProps)
  }
}
