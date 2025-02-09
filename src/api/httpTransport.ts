enum Method {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

// Необязательный метод
function queryStringify(data: Record<string, unknown>): string {
  if (typeof data !== "object") {
    throw new Error("Data must be object");
  }

  const keys = Object.keys(data);
  return keys.reduce((result, key, index) => {
    return `${result}${key}=${encodeURIComponent(String(data[key]))}${
      index < keys.length - 1 ? "&" : ""
    }`;
  }, "?");
}

class HTTPTransport {
  private readonly baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  public get = (
    url: string,
    options: RequestOptions = {}
  ): Promise<XMLHttpRequest> => {
    return this.request(
      this.baseURL + url,
      { ...options, method: Method.GET },
      options.timeout
    );
  };

  public post = (
    url: string,
    options: RequestOptions = {}
  ): Promise<XMLHttpRequest> => {
    return this.request(
      this.baseURL + url,
      { ...options, method: Method.POST },
      options.timeout
    );
  };

  public put = (
    url: string,
    options: RequestOptions = {}
  ): Promise<XMLHttpRequest> => {
    return this.request(
      this.baseURL + url,
      { ...options, method: Method.PUT },
      options.timeout
    );
  };

  public delete = (
    url: string,
    options: RequestOptions = {}
  ): Promise<XMLHttpRequest> => {
    return this.request(
      this.baseURL + url,
      { ...options, method: Method.DELETE },
      options.timeout
    );
  };

  protected request = (
    url: string,
    options: RequestOptions = {},
    timeout: number = 5000
  ): Promise<XMLHttpRequest> => {
    const { headers = {}, method, data } = options;

    return new Promise((resolve, reject) => {
      if (!method) {
        reject(new Error("No method"));
        return;
      }

      const xhr = new XMLHttpRequest();
      const isGet = method === Method.GET;

      xhr.open(method, isGet && !!data ? `${url}${queryStringify(data)}` : url);

      Object.keys(headers).forEach((key) => {
        xhr.setRequestHeader(key, headers[key]);
      });

      xhr.onload = function () {
        resolve(xhr);
      };

      xhr.onabort = reject;
      xhr.onerror = reject;

      xhr.timeout = timeout;
      xhr.ontimeout = reject;

      if (isGet || !data) {
        xhr.send();
      } else {
        xhr.send(JSON.stringify(data));
      }
    });
  };
}

type RequestOptions = {
  method?: Method;
  headers?: Record<string, string>;
  data?: Record<string, unknown>;
  timeout?: number;
};

export { HTTPTransport, Method };
