import { createApp } from 'vue'
import App from './App.vue'
import io from 'socket.io-client'

const socket = io("ws://i9a701.p.ssafy.io/api");
// const socket = io("http://localhost:4060");//test



// App.config.globalProperties.$socket = socket;
const app = createApp(App);
app.config.globalProperties.$socket = socket;
console.log(socket);


app.mount('#app')
// console.log(app.config.globalProperties.$socket);
// console.log(App);
// createApp(App).mount('#app')
//팀원간 테스트까지 마친 최종코드
