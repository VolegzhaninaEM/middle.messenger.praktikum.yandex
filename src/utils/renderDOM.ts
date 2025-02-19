import { Component } from "../services/component";

export function render(query: string, block: Component) {
    const root = document.querySelector(query) as HTMLElement
    root.textContent = block.getContent()?.outerHTML || '';
    return root;
  }
