<template>
  <div class="login">
    <div class="login-body">
      <form v-show="!reset">
        <div class="error">{{ err }}</div>
        <label for="email">Email: <span class="error">{{errs.email}}</span></label>
        <input
          v-model="form.email"
          class="form-control"
          type="text"
          name="email"
          placeholder="Email"
        />
        <label for="password">Password: <span class="error">{{errs.password}}</span> </label>
        <input
          v-model="form.password"
          class="form-control"
          type="password"
          name="password"
          placeholder="Password"
        />
        <div class="btn btn-reset-password" @click="openResetForm">
          Quên mật khẩu
        </div>
        <div class="btn-submit" @click="submit">Đăng nhập</div>
      </form>
      <div class="form" v-show="reset">
        <div class="error">{{ err }}</div>
        <div class="message">{{ message }}</div>
        <div class="form-label">Nhập địa chỉ email:</div>
        <input type="text" class="form-control" v-model="emailReset" />
        <div class="d-flex justify-content-center">
          <div class="btn-submit bg-grey me-3" @click="openLoginForm">
            Đăng nhập
          </div>
          <div class="btn-submit" @click="sendEmail">Xác nhận</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import helper from "./Helper/Helper";
export default {
  name: "Login",
  created() {
    this.check();
  },
  data() {
    return {
      err: null,
      form: {
        email: null,
        password: null,
      },
      reset: false,
      emailReset: "",
      timeout: null,
      message:'',
      errs:{
        email: null,
        password: null,
      },
    };
  },
  computed: {
    ...mapGetters(["user"]),
  },
  methods: {
    ...mapActions(["login", "resetPassword"]),
    resetForm() {
      this.err = null;
      this.form = {
        email: null,
        password: null,
      };
      this.emailReset = null;
      this.timeout = null;
    },
    async submit() {
      
      const res = await this.login(this.form);
      if (!res.err) {
        this.form = {
          email: null,
          password: null,
        };
        this.$router.push("/");
      } else {
        this.err = res.err;
      }
    },
    check() {
      this.err = null;
      if (this.user.name) {
        this.$router.push("/");
      }
    },
    async sendEmail() {
      if(this.err) return
      const res= await this.resetPassword({
        email: this.emailReset
      })
      if(res.err){
        this.err= res.err
        return
      }
      this.message= res.message
      setTimeout(()=>{
        this.message= null
        this.reset= false
      }, 3000)
    },
    openResetForm() {
      this.resetForm();
      this.reset = true;
    },
    openLoginForm() {
      this.resetForm();
      this.reset = false;
    },
  },
  watch: {
    emailReset(newValue) {
      if (this.timeout) clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        const check = helper.checkEmail(newValue);
        if (!check && this.reset=== true) {
          this.err = "Email không hợp lệ";
        } else {
          this.err = null;
        }
      }, 600);
    },
    reset(){
      this.resetForm()
    },
    'form.email': function (newValue){
      if(this.timeout) clearTimeout(this.timeout)
      this.timeout= setTimeout(()=>{
        if(!helper.checkEmail(newValue) && newValue!==null){
          this.errs.email= "Email không hợp lệ"
        }else{
          this.errs.email= null
        }
      }, 800)
    },
    'form.password': function (newValue){
      if(this.timeout) clearTimeout(this.timeout)
      this.timeout= setTimeout(()=>{
        if(!helper.checkPassword(newValue) && newValue!==null){
          this.errs.password= "Password phải từ 8-20 ký tự"
        }else{
          this.errs.password= null
        }
      }, 800)
    }
  },
};
</script>

<style scoped>
.login {
  background: #f0f0f1;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-body {
  position: relative;
  max-width: 300px;
  background: #fff;
  padding: 20px 20px;
  border: 1px solid black;
  border-radius: 4px;
}
.error {
  color: red;
  margin-bottom: 8px;
  width: 100%;
}
.message{
  color: green;
  font-weight: 500;
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
.bg-grey {
  background: #ccc;
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