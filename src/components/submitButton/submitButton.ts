import { Component } from "../../services/component";
import { TProps, TAttributesButton } from "../../types/types";

type TPropsButton = TProps & TAttributesButton;

export class SubmitButton extends Component {
  constructor(tagName: string, props: TPropsButton) {
    super(tagName, {
      ...props,
      attr: {
        ...props.attr,
        type: "submit",
      },
    });
  }

  getValue() {
    return (this.element as HTMLInputElement).value;
  }

  render(): DocumentFragment {
    return this.compile("", this.childProps);
  }
}
