import { Component } from '../../services/component'
import { TProps, TAttributesInput } from '../../types/types'

type TPropsPhone = TProps & TAttributesInput
export class PhoneInput extends Component {
  constructor(tagName: string, props: TPropsPhone) {
    super(tagName, {
      ...props,
      attr: {
        ...props.attr,
        type: 'text',
        class: 'inputField'
      }
    })
  }

  getValue() {
    return (this.element as HTMLInputElement).value
  }

  render(): DocumentFragment {
    return this.compile('', this.childProps)
  }
}
