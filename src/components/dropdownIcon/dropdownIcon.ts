import './dropdownIcon.less';
import { Component } from "../../services/component";
import { TProps } from "../../types/types";
import { default as iconTemplate } from "./dropdownIcon.hbs?raw";

type TDropdownIcon = TProps & {
  url?: string;
};
export class DropdownIcon extends Component {
  constructor(tagName: string, props: TDropdownIcon) {
    super(tagName, { ...props, attr: { class: "menu__button" } });
  }

  render() {
    return this.compile(iconTemplate, this.childProps);
  }
}
