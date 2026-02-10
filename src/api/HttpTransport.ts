export enum METHOD {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE'
}

type QueryParams = Record<string, unknown>;

type RequestOptions<TData = unknown> = {
  method?: METHOD;
  data?: TData;
  headers?: Record<string, string>;
  timeout?: number;
  withCredentials?: boolean;
};

type OptionsWithoutMethod = Omit<RequestOptions, 'method'>;

type HTTPMethod = <R = unknown>(url: string, options?: OptionsWithoutMethod) => Promise<R>;

function stringifyQueryParams(data: QueryParams): string {
  if (typeof data !== 'object') return '';
  return Object.keys(data)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(String(data[key]))}`)
    .join('&');
}

export class HTTPTransport {
  private readonly BASE_URL: string;

  constructor(baseURL: string) {
    this.BASE_URL = baseURL;
  }

  private createMethod(method: METHOD): HTTPMethod {
    return <R = unknown>(url: string, options: OptionsWithoutMethod = {}): Promise<R> => {
      let finalUrl = url;

      if (method === METHOD.GET && options.data && !(options.data instanceof FormData)) {
        const query = stringifyQueryParams(options.data as QueryParams);
        if (query) {
          const separator = url.includes('?') ? '&' : '?';
          finalUrl = `${url}${separator}${query}`;
        }
      }
      return this.request<R>(finalUrl, { ...options, method });
    };
  }

  public readonly get = this.createMethod(METHOD.GET);
  public readonly post = this.createMethod(METHOD.POST);
  public readonly put = this.createMethod(METHOD.PUT);
  public readonly patch = this.createMethod(METHOD.PATCH);
  public readonly delete = this.createMethod(METHOD.DELETE);

  private request<R>(url: string, options: RequestOptions): Promise<R> {
    const { method = METHOD.GET, data, headers = {}, timeout = 5000, withCredentials = true } = options;

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const fullUrl = `${this.BASE_URL}${url}`;

      xhr.open(method, fullUrl);

      Object.keys(headers).forEach(key => xhr.setRequestHeader(key, headers[key]));

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          if (xhr.status === 204 || !xhr.response) {
            return resolve(undefined as R);
          }

          const contentType = xhr.getResponseHeader('Content-Type');
          if (contentType?.includes('application/json')) {
            try {
              resolve(JSON.parse(xhr.response));
            } catch {
              resolve(xhr.response);
            }
          } else {
            resolve(xhr.response);
          }
        } else {
          reject(xhr);
        }
      };

      xhr.onabort = () => reject(new Error('Aborted'));
      xhr.onerror = () => reject(new Error('Network Error'));
      xhr.timeout = timeout;
      xhr.ontimeout = () => reject(new Error('Request Timed Out'));

      xhr.withCredentials = withCredentials;

      if (method === METHOD.GET || !data) {
        xhr.send();
      } else if (data instanceof FormData) {
        xhr.send(data);
      } else {
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(data));
      }
    });
  }
}
