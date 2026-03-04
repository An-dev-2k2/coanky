import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import store from './state/store'
import AOS from 'aos'
import 'aos/dist/aos.css'

const app = createApp(App)

AOS.init()
app.use(router)
app.use(Toast)
app.use(store)
app.mount('#app')
