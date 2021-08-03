<template>
  <div class="loading" v-show="isShow">
    <div class="container" >
      <div class="square"></div>
      <div class="square"></div>
      <div class="square"></div>
      <div class="square"></div>
      <div class="square"></div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
export default {
  name: "Loading",
  mounted(){
      this.setState()
  },
  data() {
    return {
      timeout: null,
      isShow: false,
    };
  },
  computed: {
    ...mapGetters(["fetchStatus"]),
  },
  methods:{
      ...mapMutations(['RESET']),
      setState(){
          if(this.timeout) clearTimeout(this.timeout)
          if(this.fetchStatus.pending){
              this.isShow= true
              this.timeout= setTimeout(()=>{
                  this.isShow= false
                  clearTimeout(this.timeout)
              }, 3000)
          }
      }
  },
  watch:{
      'fetchStatus.done':function(){
          if(this.fetchStatus.done){
              setTimeout(()=>{
                  clearTimeout(this.timeout)
                  this.isShow= false
                  this.RESET()
              },500)
          }
      },
      'fetchStatus.pending': function(){
          if(this.fetchStatus.pending){
              this.setState()
          }
      }
  }
};
</script>

<style scoped>
.loading{
    min-height: 100%;
    width: 100%;
    position: absolute;
    background: #fff;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    display: flex;
    justify-content: center;
    z-index: 100;
}
.container {
  width:  250px;
  display: flex;
  justify-content: space-between;
  position: relative;
}

.square {
  width: 33px;
  height: 33px;
  position: relative;
  top: 30%;
  display: block;
  transform-origin: -50% center;
  border-radius: 15%;
}
.square:after {
  content: "";
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
  background-color: lightblue;
  border-radius: 15%;
  box-shadow: 0px 0px 10px 0px rgba(28, 159, 255, 0.4);
}
.square:nth-child(1) {
  animation: slide 1.5s ease-in-out infinite alternate;
}
.square:nth-child(1):after {
  animation: color-change 1.5s ease-in-out infinite alternate;
}
.square:nth-child(2) {
  animation: flip-1 1.5s ease-in-out infinite alternate;
}
.square:nth-child(2):after {
  animation: squidge-1 1.5s ease-in-out infinite alternate;
}
.square:nth-child(3) {
  animation: flip-2 1.5s ease-in-out infinite alternate;
}
.square:nth-child(3):after {
  animation: squidge-2 1.5s ease-in-out infinite alternate;
}
.square:nth-child(4) {
  animation: flip-3 1.5s ease-in-out infinite alternate;
}
.square:nth-child(4):after {
  animation: squidge-3 1.5s ease-in-out infinite alternate;
}
.square:nth-child(5) {
  animation: flip-4 1.5s ease-in-out infinite alternate;
}
.square:nth-child(5):after {
  animation: squidge-4 1.5s ease-in-out infinite alternate;
}
.square:nth-child(2):after {
  background-color: #1c9fff;
}
.square:nth-child(3):after {
  background-color: #1fb1fd;
}
.square:nth-child(4):after {
  background-color: #22c7fb;
}
.square:nth-child(5):after {
  background-color: #23d3fb;
}

@keyframes slide {
  0% {
    background-color: #1795ff;
    transform: translatex(0vw);
  }
  100% {
    background-color: #23d3fb;
    transform: translatex(
      calc(250px - (33px * 1.25))
    );
  }
}
@keyframes color-change {
  0% {
    background-color: #1795ff;
  }
  100% {
    background-color: #23d3fb;
  }
}
@keyframes flip-1 {
  0%,
  15% {
    transform: rotate(0);
  }
  35%,
  100% {
    transform: rotate(-180deg);
  }
}
@keyframes squidge-1 {
  5% {
    transform-origin: center bottom;
    transform: scalex(1) scaley(1);
  }
  15% {
    transform-origin: center bottom;
    transform: scalex(1.3) scaley(0.7);
  }
  25%,
  20% {
    transform-origin: center bottom;
    transform: scalex(0.8) scaley(1.4);
  }
  55%,
  100% {
    transform-origin: center top;
    transform: scalex(1) scaley(1);
  }
  40% {
    transform-origin: center top;
    transform: scalex(1.3) scaley(0.7);
  }
}
@keyframes flip-2 {
  0%,
  30% {
    transform: rotate(0);
  }
  50%,
  100% {
    transform: rotate(-180deg);
  }
}
@keyframes squidge-2 {
  20% {
    transform-origin: center bottom;
    transform: scalex(1) scaley(1);
  }
  30% {
    transform-origin: center bottom;
    transform: scalex(1.3) scaley(0.7);
  }
  40%,
  35% {
    transform-origin: center bottom;
    transform: scalex(0.8) scaley(1.4);
  }
  70%,
  100% {
    transform-origin: center top;
    transform: scalex(1) scaley(1);
  }
  55% {
    transform-origin: center top;
    transform: scalex(1.3) scaley(0.7);
  }
}
@keyframes flip-3 {
  0%,
  45% {
    transform: rotate(0);
  }
  65%,
  100% {
    transform: rotate(-180deg);
  }
}
@keyframes squidge-3 {
  35% {
    transform-origin: center bottom;
    transform: scalex(1) scaley(1);
  }
  45% {
    transform-origin: center bottom;
    transform: scalex(1.3) scaley(0.7);
  }
  55%,
  50% {
    transform-origin: center bottom;
    transform: scalex(0.8) scaley(1.4);
  }
  85%,
  100% {
    transform-origin: center top;
    transform: scalex(1) scaley(1);
  }
  70% {
    transform-origin: center top;
    transform: scalex(1.3) scaley(0.7);
  }
}
@keyframes flip-4 {
  0%,
  60% {
    transform: rotate(0);
  }
  80%,
  100% {
    transform: rotate(-180deg);
  }
}
@keyframes squidge-4 {
  50% {
    transform-origin: center bottom;
    transform: scalex(1) scaley(1);
  }
  60% {
    transform-origin: center bottom;
    transform: scalex(1.3) scaley(0.7);
  }
  70%,
  65% {
    transform-origin: center bottom;
    transform: scalex(0.8) scaley(1.4);
  }
  100%,
  100% {
    transform-origin: center top;
    transform: scalex(1) scaley(1);
  }
  85% {
    transform-origin: center top;
    transform: scalex(1.3) scaley(0.7);
  }
}
</style>