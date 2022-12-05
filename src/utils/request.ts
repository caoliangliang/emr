import axios from 'axios'
import { useUserStore } from '@/stores/user'

// 创建一个独立实例对象
const instance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 5000,
})

// 添加请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    const userStore = useUserStore()
    // 统一添加基地址
    if (config.baseURL !== '') {
      config.baseURL = import.meta.env.DEV
        ? import.meta.env.VITE_APP_BASE_API
        : userStore.settings.baseURL
    }
    // 统一添加请求头的token
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
    // 对响应错误做点什么
    const res = error.response
    const userStore = useUserStore()
    const router = useRouter()

    if (res.status == 401) {
      // 401 刷新token
      await userStore.refreshUserToken()
      // 重新请求
      return instance.request(error.config)
    } else if (
      res.status == 500 &&
      res.config.url === '/maint/account' &&
      res.config.method === 'put'
    ) {
      // 500 并且刷新token接口错误
      userStore.clearUserData()
      await router.push('/login')
    } else {
      // 提示错误信息
      ElMessage.error(res.data.detail || res.data.title)
    }

    return Promise.reject(error)
  },
)

export default instance.request
