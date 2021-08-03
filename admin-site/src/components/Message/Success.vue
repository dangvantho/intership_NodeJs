<template>
  <div class="toast">
    <div class="toast__body">
      <img :src="success" class="toast--img toast--success" />
      {{ content }}
      <!-- <img :src="close" class="toast--img toast--closed"> -->
    </div>
  </div>
</template>

<script>
import close from "../../assets/close.png";
import success from "../../assets/success.svg";
export default {
  name: "Success",
  props: ["visibility", "content"],
  data() {
    return {
      close,
      success,
    };
  },
};
</script>

<style>
.toast {
  position: fixed;
  z-index: 99;
  /* transition: visibility 0.5s linear; */
  top: 50px;
  right: 0;
  /* border: 1px solid #ccc; */
}
.toast__body {
  margin-right: 20px;
  box-shadow: 0 0 10px #ccc;
  overflow-x: hidden;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  animation: enter 0.7s linear;
  color: green;
  padding: 4px 20px;
  text-shadow: 2px 2px 6px #fff;
}
.toast--img {
  width: 24px;
  height: 24px;
}
.toast--success {
  padding-right: 8px;
}
.toast--closed {
  padding-left: 8px;
}
@keyframes enter {
  0% {
    transform: translateX(100%);
  }
  50% {
    transform: translateX(50%);
  }
  100% {
    transform: translateX(0);
  }
}
@keyframes out {
  0% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(-50%);
  }
  100% {
    transform: translateX(-100%);
  }
}
</style>