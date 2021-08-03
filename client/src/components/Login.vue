<template>
  <div class="modal">
    <div class="modal-body">
      <form ref="form">
        <div class="error">{{ err }}</div>
        <label for="email">Email: <span class='error'>{{errs.email}}</span> </label>
        <input
          v-model="form.email"
          class="form-control"
          type="text"
          name="email"
          placeholder="Email"
        />
        <label for="password">Password: <span class='error'>{{errs.password}}</span></label>
        <input
          v-model="form.password"
          class="form-control"
          type="password"
          name="password"
          placeholder="Password"
        />
        <div class="btn btn-reset-password" @click="resetPassword">
          Quên mật khẩu
        </div>
        <div class="btn-submit" @click="submit">Đăng nhập</div>
        <span class="text"></span>
        <div
          class="btn-submit btn-register"
          @click="$emit('toggleLogin', true)"
        >
          Đăng ký
        </div>
      </form>
      <div class="closed-btn" @click="closedModal()"></div>
    </div>
    <div class="closed" ref="closed" @click="closedModal()"></div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import helper from './Helper/Helper'
export default {
  name: "Login",
  created(){
    this.resetForm()
  },
  data() {
    return {
      err: null,
      timeout: null,
      form: {
        email: null,
        password: null,
      },
      errs: {
        email: null,
        password: null,
      }
    };
  },
  methods: {
    ...mapActions(["login"]),
    closedModal() {
      console.log("modal");
      this.resetForm()
      this.$emit("toggleLogin");
    },
    resetForm(){
      this.form= {
        email: null,
        password: null
      }
    },
    async submit() {
      console.log("submit");
      for(let key in this.errs){
        if(this.errs[key]) return
      }
      const validate= helper.validate(this.form)
      if(!validate.status){
        this.errs= {...validate.errs}
      }
      const { email, password} = this.form
      const res = await this.login({ email, password });
      if (!res.err) {
        this.$emit("toggleLogin");
        this.resetForm()
      } else {
        this.err = res.err;
      }
    },
    resetPassword() {
      this.closedModal();
      this.$router.push('/reset-password');
    },
  },
  watch:{
    'form.email': function(){
      if(this.timeout) clearTimeout(this.timeout)
      this.timeout= setTimeout(()=>{
        if(!helper.checkEmail(this.form.email)){
          this.errs.email="Email không hợp lệ"
        }else{
          this.errs.email= null
        }
      }, 800)
    },
    'form.password': function(){
      if(this.timeout) clearTimeout(this.timeout)
      this.timeout= setTimeout(()=>{
        if(!helper.checkPassword(this.form.password)){
          this.errs.password="Password phải từ 8-20 ký tự"
        }else{
          this.errs.password= null
        }
      }, 800)
    },
  },
};
</script>

<style scoped>
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
  min-height: 220px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
}
.error {
  color: red;
  margin-bottom: 8px;
  width: 100%;
}
form {
  display: flex;
  flex-wrap: wrap;
}
.form-control {
  display: block;
  width: 100%;
  margin: 8px 0;
  border: 1px solid #ccc;
  outline: none;
  padding: 8px 5px;
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
  width: 100%;
  cursor: pointer;
}
.btn-reset-password {
  color: blue;
  padding-bottom: 4px;
  text-decoration: underline;
}
.btn-submit {
  background: blue;
  border: none;
  color: #fff;
  opacity: 0.6;
  transition: opacity 0.3s linear;
  margin: 8px auto;
  border-radius: 4px;
  padding: 10px 20px;
}
.btn-submit:hover {
  cursor: pointer;
  opacity: 0.8;
}
.text {
  width: 100%;
  position: relative;
  margin: 10px;
  height: 1px;
  background: #ccc;
  cursor: pointer;
}
.text::before {
  content: "Hoặc";
  position: absolute;
  left: 50%;
  top: 0;
  transform: translate(-50%, -50%);
  background: #fff;
  padding: 0 12px;
}
.btn-register {
  background: green;
}
</style>