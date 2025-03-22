import { Component } from '../services/component'
import { Indexed } from '../types/types'
import store from './store'

export function connect(
  mapStateToProps: (state: Indexed<unknown>) => Indexed<unknown>
) {
  return function (Block: typeof Component) {
    return class extends Block {
      constructor(tagName = 'div', props = {}) {
        // сохраняем начальное состояние
        const state = mapStateToProps(store.getState())

        super(tagName, { ...props, ...state })
      }
    }
  }
}
