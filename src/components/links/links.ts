import { Component } from "../../services/component.js";
import { TLinks, TProps } from "../../types/types.js";

type Props = TProps & TLinks;
export class Links extends Component {
  constructor(tagName: string = "a", props: Props) {
    super(tagName, {
      ...props,
      attr: { href: props.href },
    });
  }

  render() {
    return this.compile("{{title}}", this.childProps);
  }
}
