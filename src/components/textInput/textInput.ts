import { Component } from "../../services/component";
import { TProps, TAttributesInput} from "../../types/types";

type TPropsText = TProps & TAttributesInput;
export class TextInput extends Component {
  constructor(tagName: string, props: TPropsText) {
    super(tagName, {
      ...props,
      attr: {
        ...props.attr,
        type: 'text',
        class: 'inputField'
      }
      
    });
  }

  getValue() {
    return (this.element as HTMLInputElement).value
  }

  render(): DocumentFragment {
    return this.compile('', this.childProps);
  }
}
