import './assets/main.css';
import 'primeicons/primeicons.css';
import router from './router';
import { createApp } from 'vue';
import App from './App.vue';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import axios from 'axios';
import { checkAuth } from './store/auth';

axios.defaults.withCredentials = true;

checkAuth();

createApp(App).use(router).use(Toast).mount('#app');
