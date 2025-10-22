import { createApp } from 'vue'
import { createPinia } from 'pinia'
import AdminPanel from '../pages/AdminPanel.vue'
import router from '../router/index.js'
import '../assets/main.css'

const app = createApp(AdminPanel)
const pinia = createPinia()
app.use(pinia).use(router)

// Initialize auth store similarly to the main entry so guards work
import { useAuthStore } from '../store/auth'
const store = useAuthStore(pinia)
store.init?.()

app.mount('#admin-app')