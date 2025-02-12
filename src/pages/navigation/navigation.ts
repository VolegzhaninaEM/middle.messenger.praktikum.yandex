import { Links } from '../../components'
import { Component } from '../../services/component'
import { TLinks, TProps } from '../../types/types'
import { default as template } from './navigation.hbs?raw'

type TNavigation = TProps & { links: Array<TLinks> }
export class NavigationPage extends Component {
  constructor(tagName: string = 'nav', props: TNavigation) {
    super(tagName, {
      ...props,
      attr: {
        id: 'nav'
      }
    })

    if (this.arrayChildren.nav) {
      this.arrayChildren.nav = props.links.map(link => {
        return new Links('a', link)
      })
    }
  }

  render() {
    return this.compile(template, this.childProps)
  }
}
