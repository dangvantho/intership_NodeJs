<template>
  <div class="verify">
    <Home />
    <div class="modal" v-show="open">
      <div class="modal-body">
        <div class="modal_content-title">Xác nhận</div>
        <div class="text-message">{{ pending || message }}</div>
        <div class="text-error">
          {{ err }}
        </div>
        <div class="closed-btn" @click="handleClose"></div>
      </div>
      <div class="closed" @click="handleClose"></div>
    </div>
  </div>
</template>

<script>
import Home from "../Home/Home";
import { mapActions } from "vuex";
export default {
  name: "VerifyBooking",
  components: { Home },
  created() {
    this.sendRequest();
  },
  data() {
    return {
      open: true,
      err: null,
      message: null,
      pending: "Đang xác nhận đặt vé",
    };
  },
  methods: {
    ...mapActions(["verifyBooking"]),
    async sendRequest() {
      const id = this.$router.currentRoute.params.id;
      const res = await this.verifyBooking(id);
      if (res.err) {
        this.err= res.err
        this.pending= null
      } else {
        this.message= res.message
        this.pending= null
      }
    },
    handleClose(){
      this.open= false
      this.$router.push('/')
    }
  },
};
</script>

<style >
.modal {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(134, 133, 133, 0.5);
  overflow-x: hidden;
  z-index: 9;
}
.closed {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  background-color: transparent;
}
.modal-body {
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  padding: 15px 30px;
  z-index: 11;
  background: #fff;
  width: 350px;
  border-radius: 4px;
}
.closed-btn {
  position: absolute;
  right: 10px;
  top: 10px;
  color: red;
  font-size: 20px;
  width: 24px;
  height: 24px;
  text-shadow: 0 0 5px rgba(216, 38, 38, 0.8);
  transition: all 0.3s linear;
}
.modal_content-title {
  font-size: 24px;
  font-weight: 600;
  padding-bottom: 14px;
  color: green;
  text-align: center;
  opacity: 0.6;
}
.closed-btn:hover {
  cursor: pointer;
  color: #fff;
  background: rgba(216, 38, 38, 0.8);
  border-radius: 50%;
}
.closed-btn::before {
  content: "x";
  position: absolute;
  top: -50%;
  left: 50%;
  transform: translate(-50%, 25%);
}
.text-message{
  text-align: center;
  color: rgb(17, 231, 70);
  font-size: 18px;
  font-weight: 500;
}
.text-error{
  text-align: center;
  color: red;
  font-size: 18px;
  font-weight: 500;
}
</style>