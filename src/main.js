import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Emitter from 'tiny-emitter';
import store from './store';
import './assets/tailwind.css'

import './assets/main.css'

const app = createApp(App)

app.config.globalProperties.$msalInstance = {};
app.config.globalProperties.$emitter = new Emitter();

app.use(router)
app.use(store)
app.mount('#app')
