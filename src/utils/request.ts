import axios from 'axios'
import { useUserStore } from '@/stores/user'

// 定义接口基准路径
export const baseURL = import.meta.env.VITE_APP_BASE_API

// 创建一个独立实例对象
const instance = axios.create({
  baseURL,
  timeout: 5000,
})

// 添加请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    // 统一添加请求头的token
    const userStore = useUserStore()
    const token = userStore.userInfo && userStore.userInfo.Token
    if (token) config.headers!.Authorization = `Bearer ${token}`

    return config
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error)
  },
)

// 添加响应拦截器
instance.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    return response
  },
  async (error) => {
    const res = error.response
    // 401
    if (res.status === 401) {
      const userStore = useUserStore()
      // 刷新token
      await userStore.refreshUserToken()
      // 重新请求
      return instance.request(error.config)
    } else {
      // 提示错误信息
      let msg = res.data.detail || res.data.title
      ElMessage.error(msg)
    }

    // 对响应错误做点什么
    return Promise.reject(error)
  },
)

export default instance.request
