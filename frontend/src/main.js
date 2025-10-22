import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router/index.js';
import './assets/main.css';

// Create app and pinia explicitly so we can init auth store before mount
const app = createApp(App);
const pinia = createPinia();
app.use(pinia).use(router);

// Initialize auth store: sets axios Authorization header and watches auth state
import { useAuthStore } from './store/auth';
const store = useAuthStore(pinia);
store.init();
window.__auth = store; // add this line

app.mount('#app');