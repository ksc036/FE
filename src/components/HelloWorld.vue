<template>
  <div>
    <h1 v-if="!chat">Room</h1>
    <div id="welcome" v-if="!chat">
      <input type="text" placeholder="Nick name" required v-model="nickname" />
      <input type="text" placeholder="room name" required v-model="roomName" />
      <button @click="enter_room">Enter Room</button>
    </div>

    <div v-if="chat">
      <h1>방이름#1 : {{ roomName }}</h1>
      <div>
        <p> your nickname : {{ nickname }}</p>
      <button @click="debug">디버그 버튼</button>
        <video ref="video" autoplay width="400" height="400"></video>
        
        <button id="mic" @click="cameraClick">
          {{ camera ? "카메라 끄기" : "카메라 켜기" }}
        </button>
        <button id="mute" @click="muteClick">
          {{ mic ? "마이크 끄기" : "마이크 켜기" }}
        </button>
        <h1>현재 참가자들</h1>
          <UserVideo v-for="user in users" :key="user.id" :info="user"></UserVideo>
          <!-- <video ref="peer" autoplay width="400" height="400"></video> -->
      </div>
    </div>
  </div>
</template>

<script>
import UserVideo from "./UserVideo.vue";
export default {
  name: "HelloWorld",
  components: {
    UserVideo,
  },
  // mounted(){
  //   console.log(this.$refs);
  // },
  created() {
    this.$socket.on("all_users", async (allUsers) => {
      // console.log(allUsers);
      for(let i =0; i<allUsers.length;i++){
        //소켓id , nickname
        let pc  = this.createPeerConnection(allUsers[i].id,allUsers[i].nickname); //RTC객체 생성하고 배열에 담고 이벤트등록 및 트랙등록해서 리턴
        const offer = await pc.createOffer();
        pc.setLocalDescription(offer);
        // console.log("sendOffer 보내는 곳");
        // console.log(allUsers[i].id);
        this.$socket.emit("offer", {offer,offerSendID : this.$socket.id, offerReceiveID : allUsers[i].id, offerSendNickname : allUsers[i].nickname});
      }
    });

    this.$socket.on("getOffer", async (data) => {
      // console.log("receive offer");
      let pc = this.createPeerConnection(data.offerSendID,data.offerSendNickname);
      pc.setRemoteDescription(data.offer);
      const answer = await pc.createAnswer();
      // console.log(answer);
      pc.setLocalDescription(answer);
      this.$socket.emit("answer", {answer, answerSendID:this.$socket.id, answerReceiveID:data.offerSendID});
      // console.log("sent answer");
    });

    this.$socket.on("getAnswer", (data) => {
      // console.log("receive the answer");
      let pc = this.pcs[data.answerSendID];
      pc.setRemoteDescription(data.answer);
    });

    this.$socket.on("getCandidate", (data) => {
      // console.log("recive candidate");
      let pc = this.pcs[data.candidateSendID];
      pc.addIceCandidate(data.candidate);
    });
    
    this.$socket.on("user_exit", (data) => {
      this.pcs[data.id].close();
      delete this.pcs[data.id];
      this.users = this.users.filter(user =>  user.id !== data.id);
      // console.log(this.users);
    });
  },
  data: () => {
    return {
      myStream: {},
      nickname: "",
      mic: true,
      camera: true,
      chat: false,
      roomName: "",
      users: [],
      pcs : {},
    };
  },
  props: {
    msg: String,
  },
  methods: {
    debug(){
      for(let i in this.pcs){
        console.log(this.pcs[i].getConfiguration());
      }
    },
    // this.createPeerConnection(allUsers[i].id,allUsers[i].nickname);
    createPeerConnection(socketID,nickname){
      let pc = new RTCPeerConnection(
        {
          iceServers: [
        {
            urls : [
              "stun:stun.ekiga.net",
              "stun:ideasip.com",
              "stun:stun.rixtelecom.se",
              "stun:stun.schlund.de",
"stun:stun.stunprotocol.org:3478",
"stun:stun.voiparound.com",
"stun:stun.voipbuster.com",
"stun:stun.voipstunt.com",
"stun:stun.voxgratia.org",
              "stun:stun.l.google.com:19302",
              "stun:stun1.l.google.com:19302",
              "stun:stun2.l.google.com:19302",
              "stun:stun3.l.google.com:19302",
              "stun:stun4.l.google.com:19302",
              "iphone-stun.strato-iphone.de:3478"
          ],
        },
        {
            urls: 'turn:i9a701.p.ssafy.io:3478',
            username: 'ksc',
            credential: '036'
        }
    ]
        }
      );
      this.pcs = {...this.pcs, [socketID]: pc};

      pc.addEventListener("icecandidate", (data)=>this.handleIceCandidate(data,socketID));
      pc.addEventListener("addstream", (data)=>this.handleAddStream(data,socketID,nickname));
      this.myStream.getTracks().forEach((track) => {
        pc.addTrack(track, this.myStream);
      });

      return pc;
    },
    handleAddStream(data,socketID,nickname){
      // console.log("got my peer");
      this.users.push({id: socketID, nickname, stream : data.stream});
    },
    handleIceCandidate(data,socketID){
      // console.log("send candidate");
        this.$socket.emit("candidate",{
        candidate: data.candidate,
        candidateSendID: this.$socket.id,
        candidateReceiveID: socketID
      });
    },
    cameraClick() {
      this.myStream
        .getVideoTracks()
        .forEach((track) => (track.enabled = !track.enabled));
      // console.log(this.myStream.getVideoTracks());
      this.camera = !this.camera;
    },
    muteClick() {
      // console.log(this.myStream.getAudioTracks());
      this.myStream
        .getAudioTracks()
        .forEach((track) => (track.enabled = !track.enabled));
      // console.log(this.myStream.getAudioTracks());
      this.mic = !this.mic;
    },

    //클릭하면 enter_room 실행된다.
    async enter_room() {
      await this.initCall(); //자신의 track이랑 video audio를 등록해놓고 시그널링 서버에 접속
      // this.$socket.emit("join_room", this.roomName);
    },
    async initCall() {
      this.chat = !this.chat;
      await this.getMedia();
      this.$socket.emit("join_room", {//all user 시작하는거임 //offer도 저기서 완성시키고 보냄
          nickname: this.nickname,
          roomName: this.roomName,
        });
    },
    async getMedia() {
      try {
        this.myStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        // console.log(this.$refs.video);
        this.$refs.video.srcObject = this.myStream;
      } catch (e) {
        console.log(e);
      }
    },

  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
