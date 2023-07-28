import { createApp } from 'vue'
import App from './App.vue'
import io from 'socket.io-client'

const socket = io("wss://i9a701.p.ssafy.io");


// App.config.globalProperties.$socket = socket;
const app = createApp(App);
app.config.globalProperties.$socket = socket;


app.mount('#app')
// console.log(app.config.globalProperties.$socket);
// console.log(App);
// createApp(App).mount('#app')
