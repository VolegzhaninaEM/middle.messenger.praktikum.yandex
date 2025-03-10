import { StoreEvents } from '../constants/enums'
import { Component } from '../services/component'
import { Indexed } from '../types/types'
import { isEqual } from './helpers'
import store from './store'

export function connect(mapStateToProps: (state: Indexed) => Indexed) {
  return function (Block: typeof Component) {
    return class extends Block {
      constructor(tagName = 'div', props = {}) {
        // сохраняем начальное состояние
        let state = mapStateToProps(store.getState())

        super(tagName, { ...props, ...state })

        // подписываемся на событие
        store.on(StoreEvents.Updated, () => {
          // при обновлении получаем новое состояние
          const newState = mapStateToProps(store.getState())

          // если что-то из используемых данных поменялось, обновляем компонент
          if (!isEqual(state, newState)) {
            this.setProps({ ...newState })
          }

          // не забываем сохранить новое состояние
          state = newState
        })
      }
    }
  }
}
