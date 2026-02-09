export enum METHOD {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE'
}

export type Options = {
  method?: METHOD;
  data?: Record<string, unknown> | FormData;
  headers?: Record<string, string>;
  timeout?: number;
};

export interface HTTPTransportInterface {
  get: (url: string, options?: OptionsWithoutMethod) => Promise<XMLHttpRequest>;
  post: (url: string, options?: OptionsWithoutMethod) => Promise<XMLHttpRequest>;
  put: (url: string, options?: OptionsWithoutMethod) => Promise<XMLHttpRequest>;
  patch: (url: string, options?: OptionsWithoutMethod) => Promise<XMLHttpRequest>;
  delete: (url: string, options?: OptionsWithoutMethod) => Promise<XMLHttpRequest>;
}

type OptionsWithoutMethod = Omit<Options, 'method'>;

function stringifyQueryParams(data: Record<string, unknown>): string {
  if (typeof data !== 'object') {
    throw new Error('Data must be an object');
  }
  const keys = Object.keys(data);
  return keys.reduce((result, key, index) => {
    return `${result}${encodeURIComponent(key)}=${encodeURIComponent(String(data[key]))}${index < keys.length - 1 ? '&' : ''}`;
  }, '?');
}


export class HTTPTransport implements HTTPTransportInterface {
  private BASE_URL: string;

  constructor(baseURL: string) {
    this.BASE_URL = baseURL;
  }

  get = (url: string, options: OptionsWithoutMethod = {}): Promise<XMLHttpRequest> => {
    const query = options.data ? stringifyQueryParams(options.data as Record<string, unknown>) : '';
    return this.request(`${url}${query}`, { ...options, method: METHOD.GET }, options.timeout);
  };

  post = (url: string, options: OptionsWithoutMethod = {}): Promise<XMLHttpRequest> => {
    return this.request(url, { ...options, method: METHOD.POST }, options.timeout);
  };

  put = (url: string, options: OptionsWithoutMethod = {}): Promise<XMLHttpRequest> => {
    return this.request(url, { ...options, method: METHOD.PUT }, options.timeout);
  };

  patch = (url: string, options: OptionsWithoutMethod = {}): Promise<XMLHttpRequest> => {
    return this.request(url, { ...options, method: METHOD.PATCH }, options.timeout);
  };

  delete = (url: string, options: OptionsWithoutMethod = {}): Promise<XMLHttpRequest> => {
    return this.request(url, { ...options, method: METHOD.DELETE }, options.timeout);
  };

  request = (url: string, options: Options = {}, timeout = 5000): Promise<XMLHttpRequest> => {
    const { method = METHOD.GET, data, headers = {} } = options;

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const fullUrl = `${this.BASE_URL}${url}`;
      xhr.open(method, fullUrl);

      Object.keys(headers).forEach(key => {
        xhr.setRequestHeader(key, headers[key]);
      });

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr);
        } else {
          reject(xhr);
        }
      };

      xhr.onabort = () => reject(new Error('Request aborted'));
      xhr.onerror = () => reject(new Error('Network Error'));

      xhr.timeout = timeout;
      xhr.ontimeout = () => reject(new Error('Request timed out'));

      xhr.withCredentials = true;

      if (method === METHOD.GET || !data) {
        xhr.send();
      } else if (data instanceof FormData) {
        xhr.send(data);
      } else {
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(data));
      }
    });
  };
}
