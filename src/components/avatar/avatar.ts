import { Component } from "../../services/component";
import { default as template } from "./avatar.hbs?raw";
import { TProps } from "../../types/types";

export class Avatar extends Component {
  constructor(tagName: string, props: TProps) {
    super(tagName, props);
  }

  render(): DocumentFragment {
    return this.compile(template, this.childProps);
  }
}
