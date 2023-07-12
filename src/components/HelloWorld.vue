<template>
  <div class="hello">
    <!-- {{ msg }} -->
    <p>
      {{ str }}
    </p>
    <button v-on:click="connect">버튼</button>
    <button v-on:click="sendToServer">서버 메시지 전송</button>
    <!-- <form action="">

    </form> -->
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'HelloWorld',
  data : () => {
    return {
      str : "init",
      address: 'ws://localhost:9000',
      logs: [],
    }
  },
  props: {
    msg: String,
  },
  methods : {
    connect () {
      console.log(this.socket);
      if (this.socket === undefined || this.socket.readyState === 3) {
        this.socket = new WebSocket(this.address)
        this.socket.onopen = () => {
          this.logs.push({ type: 'INFO', msg: 'CONNECTED' })
          // this.disabled = false
          console.log(this.logs);
        }
        this.socket.onerror = () => {
          this.logs.push({ type: 'ERROR', msg: 'ERROR:' })
        }
        this.socket.onmessage = ({ data }) => {
          console.log(data);
        }
        this.socket.onclose = (msg) => {
          this.logs.push({ type: 'ERROR', msg: 'Closed (Code: ' + msg.code + ', Message: ' + msg.reason + ')' })
        }
      }
    },
    sendToServer(){
      this.socket.send("클라이언트에서 메세지 전송");
    },
    test(){
      console.log("test");
// 
      axios.get("http://localhost:9000/").then(({data})=>{
        console.log(data);
      }).catch((error)=>{
        console.log(error)
      })
// 
  }
},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
