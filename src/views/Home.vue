<template>
  <div>
    <index/>
    <canvas id="canvas"></canvas>
  </div>
</template>

<script>
import index from "@/views/index.vue"
// import "./bootstrap-reboot.css"
export default {
  name: 'home',
  components:{index},
  methods:{
    loadFireworks(){
      this.$nextTick(()=>{
        require("./fireworks.js")
      })
    },
  },
  mounted() {
    this.loadFireworks()
  },

};
</script>

<style>
body {
  margin: 0;
  background-image: url('../assets/bg1.jpg');
  width: 100vw;
  height: 100vh;
  /*background-image: linear-gradient(to bottom, #1d1c2c, #3c364c);*/
}

canvas {
  display: block;
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: -1;
}
</style>

