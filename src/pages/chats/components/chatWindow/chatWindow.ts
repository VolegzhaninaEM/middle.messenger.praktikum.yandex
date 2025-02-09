import { Component } from "../../../../services/component";
import { TProps } from "../../../../types/types";
import { ChatFooter } from "../chatFooter/chatFooter";
import { ChatHeader } from "../chatHeader/chatHeader";
import { EmptyChat } from "../chatWindowEmpty/chatWindowEmpty";
import { default as template } from './chatWindow.hbs?raw'

export class ChatWindow extends Component {
  constructor(tagName: string, props: TProps) {
    super(tagName, props);

    if (!this.children.header) {
      this.children.header = new ChatHeader('div', {attr: {class: 'chat__header'}});
    }

    if (!this.children.messages) {
      this.children.messages = new EmptyChat('div', {title: 'Select a chat to start messaging'})
    }

    if (!this.children.footer) {
        this.children.footer = new ChatFooter('div', {});
    }
  }

  render(): DocumentFragment {
    return this.compile(template, this.childProps);
  }
}
