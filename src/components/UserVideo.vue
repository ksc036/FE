<template>
        <video ref="remote" autoplay playsinline width="400" height="400"></video>
        <span>{{ info.nickname }}</span>
  </template>
  <script>
  export default {
    name: "UserVideo",
    components: {
    },created(){
      console.log(this.info.stream);
    },mounted(){
        console.log(this.info);
        console.log(this.$refs);
        this.$refs.remote.srcObject = this.info.stream;
    },
    props: {
    info: Object,
  },
  };
  </script>
  
  <style>
  #app {
    /* font-family: Avenir, Helvetica, Arial, sans-serif; */
    /* -sebkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px; */
  }
  </style>
  