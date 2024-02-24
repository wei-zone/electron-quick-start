import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { log } from '@/libs'
import './assets/main.scss'
import '@arco-design/web-vue/es/message/style'

// 额外引入图标库
import ArcoVueIcon from '@arco-design/web-vue/es/icon'
import '@arco-design/web-vue/dist/arco.css'

import plugins from '@/plugins'

log()

const app = createApp(App)

app.use(plugins)
app.use(createPinia())
app.use(router)
app.use(ArcoVueIcon)

app.mount('#app')
