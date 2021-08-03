<template>
  <div class="d-flex align-items-center" style="height: 260px">
    <div class="container">
      <div class="row justify-content-center">
        <div
          class="col-12 col-md-6 title justify-content-center justify-content-md-end mb-3 mb-md-0"
        >
          Nhập email mà bạn đã đăng ký
        </div>
        <div
          class="col-12 col-md-6 d-flex justify-content-center justify-content-md-start form"
        >
          <input
            type="text"
            placeholder="Nhập email"
            v-model="email"
            class="form-input"
          />
          <div class="submit" @click="submit">Gửi</div>
          <div class="error">
            {{ err }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import helper from '../Helper/Helper'
export default {
  name: "Reset password",
  data() {
    return {
      email: "",
      err: "",
      timeout: null,
    };
  },
  computed: {},
  methods: {
    ...mapActions(["resetPassword"]),
    async submit() {
      if (!helper.checkEmail(this.email)) {
        this.err = "Email không hợp lệ";
        return;
      } 
      const res = await this.resetPassword({ email: this.email });
      if(res.err){
        this.err= res.err
        return
      }
      this.err=null
      this.$router.push('/')
    },
  },
  watch:{
    email(){
      if(this.timeout) clearTimeout(this.timeout)
      this.timeout= setTimeout(()=>{
        if(!helper.checkEmail(this.email)){
          this.err='Email không hợp lệ'
        }else{ 
          this.err= null
        }
      }, 800)
    }
  },
};
</script>

<style scoped>
.title {
  display: flex;
  align-items: center;
  padding-right: 10px;
  font-size: 18px;
  color: rgb(55, 127, 235);
  font-weight: 500;
}
.form {
  position: relative;
}
.form-input {
  border: 1px solid #ccc;
  outline: none;
  padding: 6px 10px;
  width: 250px;
}
.form-input:hover {
  border: 1px solid rgb(17, 141, 224);
}
.submit {
  background: rgb(37, 130, 236);
  opacity: 0.7;
  padding: 6px 12px;
  border-radius: 0 6px 6px 0;
  color: #fff;
  font-weight: 600;
  transition: opacity 0.4s linear;
}
.submit:hover {
  cursor: pointer;
  opacity: 1;
}
.error {
  position: absolute;
  top: 100%;
  color: red;
}
</style>