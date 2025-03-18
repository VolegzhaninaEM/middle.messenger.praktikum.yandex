// jest.setup.js
import '@testing-library/jest-dom'

beforeEach(() => {
  document.body.innerHTML = '<div id="app"></div>'
})

afterEach(() => {
  document.body.innerHTML = ''
})
