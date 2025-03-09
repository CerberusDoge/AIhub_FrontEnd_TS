// src/utils/request.js
import axios from 'axios'

// 创建 Axios 实例
const service = axios.create({
  baseURL: 'http://3a461183.r27.cpolar.top', // 基础 URL
  timeout: 5000, // 超时时间
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 在发送请求前可修改配置（例如添加 token）
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => {
    // 请求错误处理
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    // 对响应数据进行处理（例如提取 data 字段）
    return response.data
  },
  (error) => {
    // 统一错误处理（例如根据 HTTP 状态码提示）
    if (error.response) {
      switch (error.response.status) {
        case 401:
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
  }
)

export default service // 导出配置后的实例
