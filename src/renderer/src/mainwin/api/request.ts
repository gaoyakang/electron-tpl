import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { message } from 'antd'

// ===== 1. 类型声明（可按后端约定调整） =====
export interface HttpResponse<T = any> {
  code: number
  msg: string
  data: T
}

// ===== 2. 创建 axios 实例 =====
const isDev = import.meta.env.DEV ?? process.env.NODE_ENV === 'development'

const request: AxiosInstance = axios.create({
  baseURL: isDev ? '/api' : 'https://prod.xxx.com', // 自行替换
  timeout: 10_000
})

// ===== 3. 请求拦截 =====
request.interceptors.request.use(
  (config) => {
    // 自动携带 token
    const token = localStorage.getItem('token')
    if (token) config.headers!.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// ===== 4. 响应拦截 =====
request.interceptors.response.use(
  (response: AxiosResponse<HttpResponse>) => {
    console.log('响应拦截器', response)
    const { code, msg, data } = response.data
    // 约定 status === 0 为成功
    if (code === 0) return data
    // 业务错误
    message.error(msg || '服务异常')
    return Promise.reject(new Error(msg || 'Error'))
  },
  (error) => {
    // 网络 / 服务器错误
    const msg = error.response?.data?.msg || error.message || '网络异常'
    message.error(msg)

    // 登录失效示例
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ===== 5. 导出 =====
export default request
