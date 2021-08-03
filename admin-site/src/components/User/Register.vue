<template>
  <div class="register">
    <div class="register">
      <form ref="form">
        <div class="error" v-show="err">{{ err }}</div>
        <label for="email">Tên đăng nhập: </label>
        <input
          class="form-control"
          type="text"
          v-model="name"
          placeholder="Tên đăng nhập"
        />
        <div class="error" v-show="errs.name">{{ errs.name }}</div>
        <label for="email">Email: </label>
        <input
          class="form-control"
          type="text"
          v-model="email"
          placeholder="Email"
          :autocomplete="'off'"
        />
        <div class="error" v-show="errs.email">{{ errs.email }}</div>
        <label for="password">Password: </label>
        <input
          class="form-control"
          type="password"
          v-model="password"
          placeholder="Password"
          autocomplete="off"
        />
        <div class="error" v-show="errs.password">{{ errs.password }}</div>
        <label for="password">Verify password: </label>
        <input
          class="form-control"
          type="password"
          v-model="verifyPassword"
          placeholder="Verify password"
        />
        <div class="error" v-show="errs.verifyPassword">
          {{ errs.verifyPassword }}
        </div>
        <div class="btn-submit btn-register" @click="submit">Thêm mới</div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions, } from "vuex";
export default {
  name: "Register",
  data() {
    return {
      name: null,
      email: null,
      password: null,
      verifyPassword: null,
      errs: { name: null, email: null, password: null, verifyPassword: null },
      timeout: null,
      err: null,
    };
  },
  computed: {
    // ...mapGetters(["user"]),
  },
  methods: {
    ...mapActions(["register"]),
    async submit(e) {
      e.preventDefault();
      console.log(e);
      for (let key in this.errs) {
        if (this.errs[key]) return;
      }
      if (!this.verifyPassword) return;
      const data = {
        name: this.name,
        email: this.email.toLowerCase(),
        password: this.password,
      };
      // const res=await this.$store.dispatch('register',data)
      const res = await this.register(data);
      console.log(res);
      if (res.err) {
        this.err = res.err;
      } else {
        this.verifyPassword= null
        this.email= null
        this.name= null
        this.password= null
        this.$emit('close')
      }
    },
    validate(tag, newValue, err, regex) {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.timeout = setTimeout(() => {
        console.log(this[tag], 1111);
        if (!regex.test(newValue)) {
          this.errs[tag] = err;
        } else {
          this.errs[tag] = null;
        }
      }, 1000);
    },
  },
  watch: {
    email(newValue) {
      // let regex={}
      let regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      this.validate("email", newValue, "Email không hợp lệ", regex);
    },
    name(newValue) {
      let regex = /[A-Za-z0-9]/g;
      this.validate("name", newValue, "Tên đăng nhập không hợp lệ", regex);
    },
    password(newValue) {
      let regex =  /^.{8,20}$/g;
      this.validate("password", newValue, "Mật khẩu phải từ 8-20 ký tự", regex);
    },
    verifyPassword(newValue) {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.timeout = setTimeout(() => {
        if (this.password !== newValue) {
          this.errs.verifyPassword = "Password không trùng khớp";
        } else {
          this.errs.verifyPassword = null;
        }
      }, 700);
    },
  },
};
</script>

<style scoped>
.register{
  background: #fff;
  padding: 20px;
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