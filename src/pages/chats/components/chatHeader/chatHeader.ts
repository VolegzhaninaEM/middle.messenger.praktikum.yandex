import { Avatar, DropdownIcon } from "../../../../components";
import { Component } from "../../../../services/component";
import { TProps } from "../../../../types/types";
import { default as template } from './chatHeader.hbs?raw'
import './chatHeader.less';

export class ChatHeader extends Component {
  constructor(tagName: string, props: TProps) {
    super(tagName, {...props});

    if (!this.children.sender) {
        this.children.sender = new Avatar("div", {
            attr: { class: "chat__header_avatar" }
          });
    }

    if (!this.children.buttonIcon) {
        this.children.buttonIcon = new DropdownIcon('button', {
            url: './dot-icon.png'
          })
    }
  }

  render(): DocumentFragment {
    return this.compile(template, this.childProps);
  }
}
