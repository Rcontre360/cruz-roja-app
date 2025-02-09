import axios, {AxiosInstance, AxiosRequestConfig} from 'axios'
import {ServiceResponse} from '../schemas/api'

class ApiClient {
  private axiosInstance: AxiosInstance
  private token: string

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.NEXT_LOCAL_SERVER_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  setToken(token: string) {
    this.token = token
    this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  async request<T>(config: AxiosRequestConfig): Promise<ServiceResponse<T>> {
    const response = await this.axiosInstance.request<ServiceResponse<T>>(config)
    return response.data
  }

  get<T>(url: string, params?: Record<string, unknown>) {
    return this.request<T>({method: 'GET', url, params})
  }

  post<T>(url: string, data?: unknown) {
    return this.request<T>({method: 'POST', url, data})
  }

  put<T>(url: string, data?: unknown) {
    return this.request<T>({method: 'PUT', url, data})
  }

  delete<T>(url: string) {
    return this.request<T>({method: 'DELETE', url})
  }
}

export default ApiClient
