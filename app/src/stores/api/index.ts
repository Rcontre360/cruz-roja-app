import axios, {AxiosInstance, AxiosRequestConfig} from 'axios'
import {ServiceResponse} from '../../schemas/api'

const TOKEN_KEY = 'auth_token'

class ApiClient {
  private axiosInstance: AxiosInstance
  private token: string | null = null

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.loadTokenFromStorage()
  }

  loadTokenFromStorage() {
    if (typeof window == 'undefined' || this.token) return this.token || ''
    const storedToken = localStorage.getItem(TOKEN_KEY)

    if (!storedToken) return

    if (this.isTokenExpired(storedToken)) {
      localStorage.removeItem(TOKEN_KEY)
      return
    }

    this.setToken(storedToken)

    return this.token
  }

  private decodeJWT(token: string): {exp?: number} {
    try {
      const payload = token.split('.')[1]
      const decoded = JSON.parse(atob(payload))
      return decoded
    } catch (err) {
      return {}
    }
  }

  private isTokenExpired(token: string): boolean {
    const decoded = this.decodeJWT(token)
    if (!decoded.exp) return false

    const now = Math.floor(Date.now() / 1000)
    return decoded.exp < now
  }

  setToken(token: string) {
    this.token = token
    this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`
    localStorage.setItem(TOKEN_KEY, token)
  }

  async request<T>(config: AxiosRequestConfig): Promise<ServiceResponse<T>> {
    this.loadTokenFromStorage()
    const response = await this.axiosInstance.request<ServiceResponse<T>>(config)
    return response.data
  }

  get<T>(url: string, params?: Record<string, unknown>) {
    return this.request<T>({method: 'GET', url, params})
  }

  post<T>(url: string, data?: unknown, p0?: { headers: { 'Content-Type': string } }) {
    return this.request<T>({method: 'POST', url, data})
  }

  put<T>(url: string, data?: unknown) {
    return this.request<T>({method: 'PUT', url, data})
  }

  delete<T>(url: string) {
    return this.request<T>({method: 'DELETE', url})
  }
}

const api = new ApiClient()

export default api
