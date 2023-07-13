<template>
  <p>{{ obj.user }} : {{ obj.content }}</p>
</template>

<script>
// import io from 'socket.io-client';
// this.socket.on("welcome0", ()=>{
//   console.log("welcome");
// })
export default {
  name: 'MsgLine',
  created(){
    // console.log(this.obj);
  },
  data : () => {
    return {
    }
  },
  props: {
    obj: Object,
  },
  methods : {

},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
