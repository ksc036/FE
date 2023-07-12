<template>

    <h1>room</h1>

    <div>
    <button @click="connect">소켓연결</button>
  </div>

  <div id="welcome">
    <form v-on:submit="onSubmitForm">
      <input type="text" placeholder="room name" v-model="inputRoomName">
      <button> join / Create Room</button>
    </form>
  </div>

  <div id="room" v-if="roomHidden">
    <h3>Room {{ roomName }}</h3>
    <form v-on:submit="onSendMsg">
      <input type="text" placeholder="message" v-model="message">
      <button> Send </button>
    </form>
  </div>

</template>

<script>
import io from 'socket.io-client';
// this.socket.on("welcome0", ()=>{
//   console.log("welcome");
// })
export default {
  name: 'HelloWorld',
  created(){
    if(this.socket === undefined){
        this.socket = io('http://localhost:9000');
      } 
    this.socket.on("welcome", ()=>{
      console.log("welcomne");
    })
  },
  data : () => {
    return {
      str : "init",
      // address: 'http://localhost:9000',
      roomName : "",
      inputRoomName : "",
      message : "",
      roomHidden : false,
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
    onSubmitForm(e){
      e.preventDefault();
      this.socket.emit("enter_room",this.inputRoomName,this.alterRoom);
      this.roomName = this.inputRoomName; 
      this.inputRoomName = "";
    },

    onSendMsg(e){
      e.preventDefault();
      // this.socket.emit()
      this.message = "";
    },

    alterRoom(){
      this.roomHidden = !this.roomHidden;
    }
},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
