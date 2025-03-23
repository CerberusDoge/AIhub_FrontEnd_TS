/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import type {
  AxiosError,
  AxiosResponse,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from 'axios'
import router from '@/router'

const service = axios.create({
  baseURL: 'http://8.138.207.252:8080', // 基础 URL
  withCredentials: false, // 启用跨域凭证
})

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig<any>): InternalAxiosRequestConfig<any> => {
    const accessToken = localStorage.getItem('satoken')
    if (accessToken) {
      // 如果 headers 不存在，则赋值为空对象
      config.headers = config.headers || {}
      // 设置 token
      config.headers['satoken'] = accessToken
    }
    return config
  },
  (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error)
  },
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse): any => {
    return response.data
  },
  (error: AxiosError): Promise<AxiosError> => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          router.push('/login')
          localStorage.clear()
          console.error('未授权，请重新登录')
          break
        case 404:
          console.error('请求资源不存在')
          break
        default:
          console.error('请求错误:', error.message)
      }
    }
    return Promise.reject(error)
  },
)

/**
 * 封装一个请求函数，使其支持泛型返回数据类型
 * @param config Axios 请求配置对象
 * @returns 返回一个 Promise，其中泛型 T 表示后端返回数据的类型
 */
function request<T>(config: AxiosRequestConfig): Promise<T> {
  return service(config)
}

export default request
