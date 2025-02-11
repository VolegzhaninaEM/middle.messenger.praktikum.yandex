import './sendIcon.less'
import { Component } from '../../services/component'
import { TProps } from '../../types/types'
import { default as template } from './sendIcon.hbs?raw'

export class SendIcon extends Component {
  constructor(tagName: string, props: TProps) {
    super(tagName, props)
  }

  render() {
    return this.compile(template, this.childProps)
  }
}
