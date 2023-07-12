<template>
  <div class="hello">
    <!-- {{ msg }} -->
    <p>
      {{ str }}
    </p>
    <button v-on:click="connect">연결</button>
    <button v-on:click="sendToServer">서버 메시지 전송</button>
  </div>
</template>

<script>
import io from 'socket.io-client';

export default {
  name: 'HelloWorld',
  data : () => {
    return {
      str : "init",
      // address: 'http://localhost:9000',
      logs: [],
    }
  },
  props: {
    msg: String,
  },
  methods : {
    connect () {
      if(this.socket === undefined){
        this.socket = io('http://localhost:9000');
      } 
      console.log(this.socket);
    },
    sendToServer(){
      this.socket.emit("chat","geasd");
    },
},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
