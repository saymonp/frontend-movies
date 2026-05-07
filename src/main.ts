import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import i18n from './i18n/index'

import App from './App.vue'
import router from './router'
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";



const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)
app.use(Toast);

app.mount('#app')
