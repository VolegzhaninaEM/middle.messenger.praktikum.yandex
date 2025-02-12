import { Component } from '../../../../services/component'
import { TProps } from '../../../../types/types'
import { default as template } from './search.hbs?raw'

export class Search extends Component {
  constructor(tagName: string, props: TProps) {
    super(tagName, props)
  }

  render(): DocumentFragment {
    return this.compile(template, this.childProps)
  }
}
