import './error.less';
import { default as template } from './error.hbs?raw';
import { Component } from '../../services/component';
import { TProps } from '../../types/types';

export class Error extends Component {
  constructor(tagName: string, props: TProps) {
    super(tagName, props);
  }

  render(): DocumentFragment {
    return this.compile(template, this.childProps);
  }
}


