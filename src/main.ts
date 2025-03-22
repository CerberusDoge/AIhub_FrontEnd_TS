import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'highlight.js/styles/atom-one-light.css'
import App from './App.vue'
import router from './router'
import request from './utils/request'

const app = createApp(App)
app.use(createPinia())
app.use(router)

app.provide('request', request)
app.mount('#app')
