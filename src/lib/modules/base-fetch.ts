import {
  type NextApiRequestCookies,
} from "next/dist/server/api-utils"

export interface RequestConfig extends RequestInit {
  params?: Record<string, string>
  baseURL?: string
  _retry?: boolean
  url?: string
}

export interface BaseFetchResponse<T = unknown> extends Response {
  data: T
  statusCode: number
  config: RequestConfig
}

type InterceptorFn<T> = (value: T) => T | Promise<T>

class InterceptorFactory<T> {
  private handlers: InterceptorFn<T>[] = []

  use(fn: InterceptorFn<T>): number {
    this.handlers.push(fn)

    return this.handlers.length - 1
  }

  eject(id: number): void {
    if (this.handlers[id]) {
      this.handlers[id] = (value: T) =>
        value
    }
  }

  async run(value: T): Promise<T> {
    let result = value

    // eslint-disable-next-line no-restricted-syntax
    for (const handler of this.handlers) {
      // eslint-disable-next-line no-await-in-loop
      result = await handler(result)
    }

    return result
  }
}

class BaseFetch {
  private baseURL: string

  public interceptors: {
    request: InterceptorFactory<RequestConfig>
    response: InterceptorFactory<BaseFetchResponse>
  }

  constructor(baseURL = "") {
    this.baseURL = baseURL
    this.interceptors = {
      request: new InterceptorFactory<RequestConfig>(),
      response: new InterceptorFactory<BaseFetchResponse>(),
    }
  }

  // eslint-disable-next-line custom-rules/encourage-object-params
  private createUrl(
    url: string, params?: Record<string, string>
  ): string {
    const fullUrl = new URL(
      url, this.baseURL
    )

    if (params) {
      Object.entries(params).forEach(([
        key,
        value,
      ]) =>
        fullUrl.searchParams.append(
          key, value
        ))
    }

    return fullUrl.toString()
  }

  public async request<T>(
    url: string, config: RequestConfig = {
    }
  ): Promise<BaseFetchResponse<T>> {
    const {
      params, ...fetchOptions
    } = config

    // Run request interceptors
    const interceptedConfig = await this.interceptors.request.run({
      ...fetchOptions,
      params,
    })

    const fullUrl = this.createUrl(
      url, interceptedConfig.params
    )

    try {
      const response: BaseFetchResponse<T> = await fetch(
        fullUrl, interceptedConfig
      ) as BaseFetchResponse<T>
      const body = await response.json()

      response.data = body
      response.statusCode = response.status
      response.config = interceptedConfig

      // Run response interceptors
      const responseIntercepted = await this.interceptors.response.run(response)

      if (!responseIntercepted.ok) {
        throw responseIntercepted.data
      }
      return responseIntercepted as BaseFetchResponse<T>
    }
    catch (error) {
      throw error as BaseFetchResponse<T>
    }
  }

  public async get<T>(
    url: string, config: RequestConfig = {
    }
  ): Promise<T> {
    const response = await this.request<T>(
      url, {
        ...config,
        method: "GET",
      }
    )

    return response.data
  }

  public async post<T>(
    url: string, data?: unknown, config: RequestConfig = {
    }
  ): Promise<T> {
    const response = await this.request<T>(
      url, {
        ...config,
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          ...config.headers,
        },
      }
    )

    return response.data
  }

  public async put<T>(
    url: string, data?: unknown, config: RequestConfig = {
    }
  ): Promise<T> {
    const response = await this.request<T>(
      url, {
        ...config,
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          ...config.headers,
        },
      }
    )

    return response.data
  }

  public async delete<T>(
    url: string, config: RequestConfig = {
    }
  ): Promise<T> {
    const response = await this.request<T>(
      url, {
        ...config,
        method: "DELETE",
      }
    )

    return response.data
  }

  public getCookies(): NextApiRequestCookies {
    if (typeof document === "undefined") {
      return {
      }
    }

    return document.cookie.split("; ").reduce<NextApiRequestCookies>(
      // eslint-disable-next-line custom-rules/encourage-object-params
      (
        prev, current
      ) => {
        const [
          name,
          ...value
        ] = current.split("=")

        prev[name] = value.join("=")

        return prev
      }, {
      }
    )
  }
}

export default BaseFetch
