import { describe, it, expect, beforeEach } from '@jest/globals'
import HttpTransport from './httpTransport'
import { METHODS } from './types/enums'

const API_URL = 'https://ya-praktikum.tech/api/v2/api'
describe('HttpTransport', () => {
  let http: HttpTransport
  let mockXhr: jest.Mocked<XMLHttpRequest>

  beforeEach(() => {
    // Создаем экземпляр HttpTransport
    http = new HttpTransport('/api')

    // Мокируем XMLHttpRequest
    mockXhr = {
      open: jest.fn(),
      setRequestHeader: jest.fn(),
      send: jest.fn(),
      withCredentials: false,
      responseType: '',
      onload: jest.fn(),
      onerror: jest.fn(),
      onabort: jest.fn(),
      ontimeout: jest.fn(),
      timeout: 0,
      status: 200,
      response: {}
    } as unknown as jest.Mocked<XMLHttpRequest>

    // Переопределяем XMLHttpRequest глобально
    window.XMLHttpRequest = jest.fn(() => mockXhr) as any
  })

  describe('request()', () => {
    it('Должен корректно настраивать GET-запрос', async () => {
      const url = '/test'
      const options = { method: METHODS.GET, data: { key: 'value' } }

      http.request(API_URL + url, options)

      expect(mockXhr.open).toHaveBeenCalledWith(
        'GET',
        `${http['API_URL']}/api${url}?key=value`
      )
      expect(mockXhr.send).toHaveBeenCalled()
    })

    it('Должен корректно настраивать POST-запрос с JSON', async () => {
      const url = '/test'
      const options = { method: METHODS.POST, data: { key: 'value' } }

      http.request(API_URL + url, options)

      expect(mockXhr.open).toHaveBeenCalledWith('POST', `${http['API_URL']}/api${url}`)
      expect(mockXhr.setRequestHeader).toHaveBeenCalledWith('Content-Type', 'application/json')
      expect(mockXhr.send).toHaveBeenCalledWith(JSON.stringify({ key: 'value' }))
    })

    it('Должен корректно обрабатывать FormData', async () => {
      const url = '/test'
      const formData = new FormData()
      formData.append('key', 'value')

      const options = { method: METHODS.POST, data: formData }

      http.request(API_URL + url, options)

      expect(mockXhr.open).toHaveBeenCalledWith('POST', `${http['API_URL']}/api${url}`)
      expect(mockXhr.setRequestHeader).not.toHaveBeenCalled() // Заголовки не устанавливаются для FormData
      expect(mockXhr.send).toHaveBeenCalledWith(formData)
    })
  })

  describe('get()', () => {
    it('Должен формировать корректный GET-запрос', async () => {
      const url = '/test'
      const options = { data: { key: 'value' } }

      http.get(url, options)

      expect(mockXhr.open).toHaveBeenCalledWith(
        'GET',
        `${http['API_URL']}/api${url}?key=value`
      )
      expect(mockXhr.send).toHaveBeenCalled()
    })
  })

  describe('post()', () => {
    it('Должен формировать корректный POST-запрос', async () => {
      const url = '/test'
      const options = { data: { key: 'value' } }

      http.post(url, options)

      expect(mockXhr.open).toHaveBeenCalledWith('POST', `${http['API_URL']}/api${url}`)
      expect(mockXhr.setRequestHeader).toHaveBeenCalledWith('Content-Type', 'application/json')
      expect(mockXhr.send).toHaveBeenCalledWith(JSON.stringify({ key: 'value' }))
    })
  })

  describe('put()', () => {
    it('Должен формировать корректный PUT-запрос', async () => {
      const url = '/test'
      const options = { data: { key: 'value' } }

      http.put(url, options)

      expect(mockXhr.open).toHaveBeenCalledWith('PUT', `${http['API_URL']}/api${url}`)
      expect(mockXhr.setRequestHeader).toHaveBeenCalledWith('Content-Type', 'application/json')
      expect(mockXhr.send).toHaveBeenCalledWith(JSON.stringify({ key: 'value' }))
    })
  })
})
