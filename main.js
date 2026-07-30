import { createApp } from 'vue';

import App from './App.vue';
import './assets/main.css';
import router from './router';

// 정적 퍼블리싱 단계이므로 상태 관리나 API 모듈 없이 화면 이동에 필요한 라우터만 연결한다.
createApp(App).use(router).mount('#app');
