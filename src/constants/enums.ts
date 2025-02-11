export enum EVENTS {
  INIT = 'init',
  FLOW_CDM = 'flow:component-did-mount',
  FLOW_CDU = 'flow:component-did-update',
  FLOW_RENDER = 'flow:render',
  FILE_SELECT = 'file:select', // Новое событие: выбор файла
  MODAL_OPEN = 'modal:open', // Новое событие: открытие модального окна
  MODAL_CLOSE = 'modal:close'
}
