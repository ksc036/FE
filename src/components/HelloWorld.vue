<template>

  <div id="welcome" v-if="!roomHidden">
    <h1>room</h1>
    <form v-on:submit="joinRoom">
      <input type="text" placeholder="room name" v-model="inputRoomName">
      <input type="text" placeholder="nickname" v-model="nickname">
      <button> join / Create Room</button>
    </form>
  </div>

  <div id="room" v-if="roomHidden">
    <h3>Room {{ roomName }} // 내 닉네임 :{{ nickname }}</h3>
    <ul id="ul">
    <li v-for="item in messageList" :key={item}>
      <MsgLine :obj=item></MsgLine>
    </li>
  </ul>
    <form v-on:submit="sendToServer">
      <input type="text" placeholder="message" v-model="message">
      <button> Send </button>
    </form>
  </div>
  
  <!-- <button @click="test">버튼</button> -->

</template>

<script>
import MsgLine from './MsgLine.vue'

export default {
  components: {
    MsgLine
  },

  name: 'HelloWorld',

  created(){
    // console.log("created");
    this.$socket.on('welcome', ()=> {
      this.addMessage("공지","누군가 접속했습니다.");
    })

    this.$socket.on('bye', ()=> {
      this.addMessage("공지","누군가 떠났습니다.");
    })
    
    this.$socket.on('new_message', (nickname,message)=> {
      this.addMessage(nickname,message);
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
      messageList : [],
      nickname : "",
    }
  },
  props: {
    msg: String,
  },
  methods : {
    sendToServer(e){
      e.preventDefault();
      this.$socket.emit("new_message",this.roomName,this.nickname,this.message,(message)=>{
        // console.log(message);
        this.addMessage(`you(${this.nickname})`, message);
      });
      this.message = "";
    },
    joinRoom(e){
      e.preventDefault();
      if(this.nickname == "공지"){
        alert("공지 이름은 사용할 수 없습니다.");
        this.nickname = "";
        return;
      }
      this.$socket.emit("enter_room",this.inputRoomName,this.alterRoom);
      this.roomName = this.inputRoomName; 
      this.inputRoomName = "";
    },
    addMessage(user,content){
      this.messageList.push({user,content});
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
