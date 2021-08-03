<template>
  <div class="modal" >
    <div class="modal-body">
      <div class="modal_content-title">{{title}}</div>
      <div class="text-message mb-2">{{ message }}</div>
      <div class="d-flex justify-content-center">
        <div class='btn' @click="handleClose">Hủy bỏ</div>
        <div class='btn__green' @click="()=>handleDelete()">Xác nhận</div>
      </div>
      <div class="closed-btn" @click="handleClose"></div>
    </div>
    <div class="closed" @click="handleClose"></div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  name: "Alert",
  props:['title','message'],
  methods: {
    ...mapActions(['deleteAdmin']),
    handleClose() {
      this.$emit('closeAlert')
    },
    handleDelete(){
      this.$emit('handleDelete')
    }
  },
};
</script>

<style scoped >
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
  color: red;
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
.btn {
  color: orange;
  border: 1px solid orange;
  padding: 6px 12px;
  border-radius: 5px;
  margin-right: 8px;
  transition: all .3s ease-in;
}
.btn:hover{
  color: #fff;
  background: orange;
  cursor: pointer;
}
.btn__green {
  color: greenyellow;
  border: 1px solid greenyellow;
  padding: 6px 12px;
  border-radius: 5px;
  margin-right: 8px;
  transition: all .3s ease-in;
}
.btn__green:hover{
  color: #fff;
  background: greenyellow;
  cursor: pointer;
}
.text-error {
  text-align: center;
  color: red;
  font-size: 18px;
  font-weight: 500;
}
.text-message{
  color: orange;
}
</style>