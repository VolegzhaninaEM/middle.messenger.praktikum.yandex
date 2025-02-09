enum METHODS {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE'
}

type Options = {
  headers?: Record<string, string>
  method: METHODS
  data?: unknown
  timeout?: number
}
type HTTPMethod = (
  url: string,
  options: GeneralOptions
) => Promise<XMLHttpRequest>

type HTTPRequest = (
  url: string,
  options: Options
) => Promise<XMLHttpRequest>

type GeneralOptions = Omit<Options, 'method'>

export default class HttpTransport {
  get: HTTPMethod = (url, options = {}) => {
    return this.request(url, { ...options, method: METHODS.GET })
  }

  post: HTTPMethod = (url, options = {}) => {
    return this.request(url, { ...options, method: METHODS.POST })
  }

  put: HTTPMethod = (url, options = {}) => {
    return this.request(url, { ...options, method: METHODS.PUT })
  }

  delete: HTTPMethod = (url, options = {}) => {
    return this.request(url, { ...options, method: METHODS.DELETE })
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

      xhr.open(method, isGet && !!data ? `${url}${queryStringify(data)}` : url)

      Object.keys(headers).forEach(key => {
        xhr.setRequestHeader(key, headers[key])
      })

      xhr.onload = function () {
        resolve(xhr)
      }

      xhr.onabort = reject
      xhr.onerror = reject

      xhr.timeout = timeout
      xhr.ontimeout = reject

      if (isGet || !data) {
        xhr.send()
      } else {
        xhr.send(
          JSON.stringify(
            data as Document | XMLHttpRequestBodyInit | null | undefined
          )
        )
      }
    })
  }
}
function queryStringify(data: unknown) {
  if (typeof data !== 'object') {
    throw new Error('Data must be object')
  }

  if (data instanceof Object) {
    const keys = Object.keys(data)
    return keys.reduce((result, key, index) => {
      return `${result}${key}=${(data as Record<string, unknown>)[key]}${index < keys.length - 1 ? '&' : ''}`
    }, '?')
  }
}

