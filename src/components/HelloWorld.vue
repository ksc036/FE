<template>
  <div>
    <h1>Room</h1>
    <div id="welcome" v-if="!chat">
      <input type="text" placeholder="Nick name" required v-model="nickName" />
      <input type="text" placeholder="room name" required v-model="roomName" />
      <button @click="enter_room">Enter Room</button>
    </div>

    <div v-if="chat">
      <h1>{{ roomName }}</h1>
      <div>
        <video ref="video" autoplay width="400" height="400"></video>
        <button id="mic" @click="cameraClick">
          {{ camera ? "카메라 끄기" : "카메라 켜기" }}
        </button>
        <button id="mute" @click="muteClick">
          {{ mic ? "마이크 끄기" : "마이크 켜기" }}
        </button>

        <div class="peerStream">
          <video ref="peer" autoplay width="400" height="400"></video>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",

  created() {
    // this.getMedia();
    this.$socket.on("welcome", async () => {
      const offer = await this.myPeerConnection.createOffer();
      this.myPeerConnection.setLocalDescription(offer);
      console.log("sent offer");

      this.$socket.emit("offer", offer, this.roomName);
      // console.log(offer);
    });

    this.$socket.on("offer", async (offer) => {
      console.log("receive offer");
      this.myPeerConnection.setRemoteDescription(offer);
      const answer = await this.myPeerConnection.createAnswer();
      // console.log(answer);

      this.myPeerConnection.setLocalDescription(answer);
      this.$socket.emit("answer", answer, this.roomName);
      console.log("sent answer");
    });

    this.$socket.on("answer", (answer) => {
      console.log("receive the answer");
      this.myPeerConnection.setRemoteDescription(answer);
    });

    this.$socket.on("ice", (ice) => {
      console.log("recive candidate");
      this.myPeerConnection.addIceCandidate(ice);
    });
  },
  data: () => {
    return {
      myStream: {},
      nickName: "",
      mic: true,
      camera: true,
      chat: false,
      roomName: "",
    };
  },
  props: {
    msg: String,
  },
  methods: {
    cameraClick() {
      this.myStream
        .getVideoTracks()
        .forEach((track) => (track.enabled = !track.enabled));
      // console.log(this.myStream.getVideoTracks());
      this.camera = !this.camera;
    },
    muteClick() {
      console.log(this.myStream.getAudioTracks());
      this.myStream
        .getAudioTracks()
        .forEach((track) => (track.enabled = !track.enabled));
      // console.log(this.myStream.getAudioTracks());
      this.mic = !this.mic;
    },

    //클릭하면 enter_room 실행된다.
    async enter_room() {
      await this.initCall(); //자신의 track이랑 video audio를 등록해놓고 시그널링 서버에 접속
      this.$socket.emit("join_room", this.roomName);
    },
    async initCall() {
      this.chat = !this.chat;
      await this.getMedia();
      this.makeConnection(); //RTC객체를 생성하고 컴포넌트 전역에 선언함.
    },
    async getMedia() {
      try {
        this.myStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        // console.log(this.myStream);
        this.$refs.video.srcObject = this.myStream;
        // await this.getCamera();
        // this.$refs.video.play();
        // console.log(this.$refs.video)
      } catch (e) {
        console.log(e);
      }
    },
    makeConnection() {
      const peerConnection = new RTCPeerConnection();
      this.myPeerConnection = peerConnection;
      this.myPeerConnection.addEventListener("icecandidate", this.handleIce);
      this.myPeerConnection.addEventListener("addstream", this.handleAddStream);
      this.myStream.getTracks().forEach((track) => {
        this.myPeerConnection.addTrack(track, this.myStream);
      });
    },
    handleIce(data) {
      console.log("send candidate");
      this.$socket.emit("ice", data.candidate, this.roomName);
      // console.log(data);
    },
    handleAddStream(data) {
      console.log("got my peer");
      // console.log(data); //data.stream 이 동료영상
      console.log(data);
      console.log("상대스트림얻음");
      console.log(data.stream); //상대의 스트림
      this.$refs.peer.srcObject = data.stream;
      // console.log(data.stream);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
