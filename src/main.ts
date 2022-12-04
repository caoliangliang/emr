import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useUserStore } from '@/stores/user'
import App from './App.vue'
import router from './router'
// 重制样式
import 'normalize.css'
import '@/styles/base.scss'

const app = createApp(App)
app.use(createPinia())
// 获取本地配置文件
const userStore = useUserStore()
await userStore.updateSettings()
app.use(router)

app.mount('#app')
