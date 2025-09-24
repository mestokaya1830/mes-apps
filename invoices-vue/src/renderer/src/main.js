import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router.js'
import store from './store/store.js'
import 'material-icons/iconfont/material-icons.css'

createApp(App).use(router).use(store).mount('#app')
