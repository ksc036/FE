<template>
  <video ref="remote" autoplay width="400" height="400"></video>
</template>
<script>
export default {
  name: "UserVideo",
  components: {},
  created() {},
  mounted() {
    // console.log(this.info);
    // console.log(this.$refs);
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
