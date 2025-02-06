import { Component } from "../../services/component";
import { default as template } from './chats.hbs?raw';
import {default as lessInfo } from '../../partials/lessInfo.hbs?raw';
import { TProps } from "../../types/types";
import Handlebars from 'handlebars';

Handlebars.registerPartial("partials/lessInfo", lessInfo);
export class ChatPage extends Component {

    constructor(tagName: string, props: TProps) {
        super(tagName, props);
    }

    render(): DocumentFragment {
        return this.compile(template, this.childProps);
      }

}
