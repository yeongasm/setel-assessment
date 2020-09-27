import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import store from './store'
import './styles/app.scss';

createApp(App).use(store).mount('#app')
