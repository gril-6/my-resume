import { createApp } from 'vue';
import { createPinia } from 'pinia';
import naive from 'naive-ui';
import App from './App.vue';
import './styles/main.scss';

createApp(App).use(createPinia()).use(naive).mount('#app');
