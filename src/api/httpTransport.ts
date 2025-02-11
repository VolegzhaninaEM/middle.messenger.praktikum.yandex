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

type HTTPRequest = (url: string, options: Options) => Promise<XMLHttpRequest>

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

      xhr.open(
        method,
        isGet && !!data
          ? `${url}${queryStringify(data as Record<string, unknown>)}`
          : url
      )

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
