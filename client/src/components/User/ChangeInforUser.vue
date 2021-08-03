<template>
  <div class="">
    <span class="title">Thay đổi mật khẩu</span>
    <form ref="form" class="form" @submit="submit">
      <label for="" class="form-label">
        Tên đăng nhập: <span class="error">{{ errs.name }}</span>
      </label>
      <input type="text" class="form-control" v-model="name" />
      <label for="" class="form-label">
        Email: <span class="error">{{ errs.email }}</span>
      </label>
      <input type="text" class="form-control" v-model="email" />
      <div class="form-submit">
        <div class="btn btn-grey" @click="() => close()">Bỏ qua</div>
        <input
          type="submit"
          value="Lưu lại"
          class="btn btn-red"
          :disabled="disabled"
        />
      </div>
    </form>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import helper from "../Helper/Helper";
export default {
  name: "ChangeInforUser",
  created() {
    this.setState();
  },
  data() {
    return {
      name: "",
      email: "",
      errs: {
        name: "",
        email: "",
      },
      disabled: false,
      timeout: null,
    };
  },
  computed: {
    ...mapGetters(["user"]),
  },
  methods: {
      ...mapActions(['changeInformationUser']),
    setState() {
      const { name, email } = this.user;
      this.name = name;
      this.email = email;
    },
    async submit(e) {
        e.preventDefault()
        const res= await this.changeInformationUser({
            name: this.name,
            email: this.email
        })
        if(res.err){
            console.log(res)
            return
        }
        this.close()
    },
    close() {
      this.name= this.user.name
      this.email= this.user.email
      this.$emit("close");
    },
    handleCheckForm() {
      const checkEmail = helper.checkEmail(this.email);
      const checkName = this.name
      if (!checkEmail) {
        this.disabled = true;
        this.errs.email = "Địa chỉ email không hợp lệ";
      } else {
        this.errs.email = "";
      }
      if (!checkName) {
        this.disabled = true;
        this.errs.name = "Không được để trống";
      } else {
        this.errs.name = "";
      }
      if (checkEmail && checkName) {
        this.disabled = false;
      }
    },
  },
  watch: {
    name() {
      if (this.timeout) clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.handleCheckForm();
      }, 800);
    },
    email() {
      if (this.timeout) clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.handleCheckForm();
      }, 800);
    },
  },
};
</script>

<style scoped>
.title {
  margin-bottom: 20px;
  font-size: 18px;
  display: block;
}
.form {
  display: flex;
  padding: 16px 24px;
  background: #fff;
  flex-wrap: wrap;
}
.form-label {
  margin-bottom: 6px;
  width: 100%;
}
.error {
  color: red;
}
.form-control {
  display: block;
  width: 100%;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  padding: 8px 10px;
  outline: none;
}
.form-control:hover {
  border-color: rgb(29, 127, 240);
}
.form-submit {
  width: 100%;
  display: flex;
  justify-content: center;
}
.btn {
  padding: 8px 16px;
  border: none;
  outline: none;
  border-radius: 6px;
  margin-right: 12px;
  background: grey;
  opacity: 0.7;
  color: #fff;
  font-size: 16px;
  font-weight: 400;
}
.btn:hover {
  opacity: 0.9;
  cursor: pointer;
}
.btn:disabled {
  cursor: not-allowed;
}
.btn-red {
  background: red;
}
</style>