import './inputErrorCapture.less'
import { Component } from "../../services/component";
import { TProps } from "../../types/types";

interface IFooter {
  errorMessage: string;
}

export class InputErrorCapture extends Component implements IFooter {
  errorMessage: string = "";
  constructor(tagName: string, props: TProps) {
    super(tagName, {
      ...props,
      attr: {
        ...props.attr,
        errorMessage: "",
      },
    });
  }

  componentDidUpdate(oldProps: TProps, newProps: TProps) {
    return oldProps !== newProps;
  }

  getValue() {
    return (this.element as HTMLInputElement).value;
  }

  render(): DocumentFragment {
    return this.compile('{{errorMessage}}', this.childProps);
  }
}
