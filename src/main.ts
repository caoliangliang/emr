import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
// 重制样式
import 'normalize.css'
import '@/styles/base.scss'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
