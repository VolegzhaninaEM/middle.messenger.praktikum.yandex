import { Component } from '../services/component'

export function render(query: string, block: Component) {
  const root = document.getElementById(query) as HTMLElement
  const element = block.getContent()
  if (root && element) root.replaceChildren(element)
  block.dispatchComponentDidMount()
}
