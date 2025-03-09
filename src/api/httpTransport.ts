import { METHODS } from './types/enums'
import { HTTPMethod, HTTPRequest, TFetch } from './types/types'

export default class HttpTransport {
  endpoint: string

  private API_URL = 'https://ya-praktikum.tech/api/v2'
  constructor(endpoint: string) {
    this.endpoint = `${this.API_URL}${endpoint}`
  }

  get: HTTPMethod = (url, options = {}) => {
    return this.request(this.endpoint + url, {
      ...options,
      method: METHODS.GET
    })
  }

  post: HTTPMethod = (url, options = {}) => {
    const requestURL = url.length ? this.endpoint + url : this.endpoint
    return this.request(requestURL, {
      ...options,
      mode: 'cors',
      credentials: 'include',
      method: METHODS.POST
    })
  }

  put: HTTPMethod = (url, options = {}) => {
    return this.request(this.endpoint + url, {
      ...options,
      method: METHODS.PUT
    })
  }
  
  delete: HTTPMethod = (url, options = {}) => {
    return this.request(this.endpoint + url, {
      ...options,
      method: METHODS.DELETE
    })
  }

  fetch: TFetch = (url, id) => {
    return fetch(this.endpoint + url + id, {
      method: METHODS.POST,
      credentials: 'include'
    })
  }

  request: HTTPRequest = (url, options) => {
    const { headers = {}, method, data, timeout = 5000 } = options

    return new Promise(function (resolve, reject) {
      if (!method) {
        reject('No method')
        return
      }

      const xhr = new XMLHttpRequest()
      const isGet = method === METHODS.GET

      xhr.open(
        method,
        isGet && !!data
          ? `${url}${queryStringify(data as Record<string, unknown>)}`
          : url
      )

      Object.keys(headers).forEach(key => {
        xhr.setRequestHeader(key, headers[key])
      })
      xhr.withCredentials = true

      xhr.onload = function () {
        resolve(xhr)
      }
      xhr.responseType = 'json'

      xhr.onabort = reject
      xhr.onerror = reject

      xhr.timeout = timeout
      xhr.ontimeout = reject

      if (isGet || !data) {
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.send()
      } else {
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.send(
          JSON.stringify(
            data as Document | XMLHttpRequestBodyInit | null | undefined
          )
        )
      }
    })
  }
}
function queryStringify(data: Record<string, unknown>): string {
  if (typeof data !== 'object' || data === null) {
    throw new Error('Data must be an object')
  }

  const params = new URLSearchParams()

  const processValue = (key: string, value: unknown) => {
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        processValue(`${key}[${index}]`, item)
      })
    } else if (typeof value === 'object' && value !== null) {
      Object.entries(value).forEach(([nestedKey, nestedValue]) => {
        processValue(`${key}[${nestedKey}]`, nestedValue)
      })
    } else {
      params.append(key, String(value))
    }
  }

  Object.entries(data).forEach(([key, value]) => {
    processValue(key, value)
  })

  return `?${params.toString()}`
}
