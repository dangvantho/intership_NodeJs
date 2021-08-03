<template>
  <div class="manage-user">
    <div class="container" style="margin-top: 20px">
      <div class="row">
        <div class="col-12 col-sm-4">
          <div class="user">
            <div class="img">
              <span>{{ fisrtLetter }}</span>
            </div>
            <div
              :class="{ 'user-text': true, active: status.home }"
              @click="() => toggle('home')"
            >
              Quản lý tài khoản
            </div>
          </div>
          <ul class="list">
            <li
              :class="{ 'list-item': true, active: status.order }"
              @click="() => toggle('order')"
            >
              Danh sách đặt hàng
            </li>
            <li
              :class="{ 'list-item': true, active: status.password }"
              @click="() => toggle('password')"
            >
              Đổi mật khẩu
            </li>
            <li class="list-item" @click="() => logout()">Đăng xuất</li>
          </ul>
        </div>
        <div class="col-12 col-sm-8" style="position: relative;">
          <div class="home" v-show="status.home">
            <span class="title">Thông tin người dùng</span>
            <div class="info-user">
              <div class="info-title">
                <span>Thông tin cá nhân</span>
                <span @click="toggle('changeInfo')">Chỉnh sửa</span>
              </div>
              <div class="info-content">Tên: {{ user.name }}</div>
              <div class="info-content">Email: {{ user.email }}</div>
            </div>
          </div>
          <div class="order" v-show="status.order">
            <span class="title">Thông tin người dùng</span>
            <table>
              <thead>
                <tr>
                  <th>Mã vé</th>
                  <th>Ngày mua vé</th>
                  <th>Giá vé</th>
                  <th>Xem chi tiết</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in user_orders" :key="order.id">
                  <td>{{ order.id }}</td>
                  <td>{{formatTimeStamp(order.create_at)  }}</td>
                  <td>{{ formatMoney( order.price, 1) }}</td>
                  <td>
                    <router-link class="link" :to="`/order/search/${order.id}`"
                      >Xem</router-link
                    >
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="password" v-show="status.password">
            <span class="title">Thay đổi mật khẩu</span>
            <form ref="form" class="form" @submit="submit">
              <label for="" class="form-label">
                Mật khẩu cũ: <span class="error">{{ errs.oldPassword }}</span>
              </label>
              <input type="text" class="form-control" v-model="oldPassword" />
              <label for="" class="form-label">
                Mật khẩu mới: <span class="error">{{ errs.newPassword }}</span>
              </label>
              <input
                type="password"
                class="form-control"
                v-model="newPassword"
              />
              <label for="" class="form-label">
                Xác nhận mật khẩu mới:
                <span class="error">{{ errs.verify }}</span>
              </label>
              <input
                type="password"
                class="form-control"
                v-model="verifyPassword"
              />
              <div class="form-submit">
                <div class="btn btn-grey" @click="handleCloseChangePassword">
                  Bỏ qua
                </div>
                <input
                  type="submit"
                  value="Lưu lại"
                  class="btn btn-red"
                  :disabled="disabled"
                />
              </div>
            </form>
          </div>
          <div class='home' v-show="status.changeInfo">
            <ChangeInforUser v-on:close="()=>toggle('home')"/>
          </div>
          <loading/>
        </div>
      </div>
    </div>
    <success v-show="message" :content="message" />
    <error v-show="resetErr" :content="resetErr" />
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import ChangeInforUser from './ChangeInforUser.vue'
import Error from "../Message/Error.vue";
import Success from "../Message/Success.vue";
import helper from '../Helper/Helper'
import Loading from '../Loading.vue';
export default {
  name: "User",
  components: { Success, Error, ChangeInforUser, Loading, },
  created() {
    this.fetchOrders();
  },
  data() {
    return {
      status: {
        home: true,
        order: false,
        password: false,
        changeInfo: false,
      },
      newPassword: "",
      oldPassword: "",
      verifyPassword: "",
      errs: { newPassword: null, oldPassword: null, verify: null },
      resetErr: null,
      disabled: true,
      timeout: null,
      message: null,
    };
  },
  computed: {
    ...mapGetters(["user", "user_orders"]),
    fisrtLetter() {
      const name = this.user.name;
      const length = name.split(" ").length;
      return name.split(" ")[length - 1];
    },
  },
  methods: {
    ...mapMutations(["LOG_OUT"]),
    ...mapActions(["changePassword", "fetchOrders"]),
    toggle(key) {
      for (let key in this.status) {
        this.status[key] = false;
      }
      this.status[key] = true;
    },
    logout() {
      this.LOG_OUT();
      this.$router.push("/");
    },
    checkForm(newValue, key) {
      let regex = /^(?=.{8,20})/g;
      if (this.timeout) clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        if (
          this.newPassword === this.verifyPassword &&
          this.oldPassword &&
          this.newPassword
        ) {
          this.disabled = false;
        } else {
          this.disabled = true;
        }
        if (!newValue) {
          this.errs[key] = "Không được để trống";
        } else {
          this.errs[key] = "";
        }
        if (key === "verify") {
          if (this.newPassword === this.verifyPassword) {
            this.errs[key] = "";
          } else this.errs[key] = "Mật khẩu mới không đúng";
        }
        if (!regex.test(newValue)) {
          this.errs[key] = "Mật khẩu phải từ 8-20 ký tự";
        }
      }, 800);
    },
    formatMoney(price, type){
      return helper.formatMoney(price, type)
    },
    formatTimeStamp(time){
      const timeStamp= new Date(time)
      const day= timeStamp.getDate(),
            month= timeStamp.getMonth(),
            year= timeStamp.getFullYear();
      return `${day}/${month}/${year}`
    },
    async submit(e) {
      e.preventDefault();
      const data = {
        password: this.oldPassword,
        newPassword: this.newPassword,
      };
      const res = await this.changePassword(data);
      if (res.err) {
        this.resetErr = res.err;
        this.message = null;
        setTimeout(() => {
          this.resetErr = null;
        }, 8000);
      } else {
        this.message = res.message;
        this.resetErr = null;
        this.oldPassword=''
        this.newPassword=''
        this.verifyPassword=''
        setTimeout(() => {
          this.message = null;
        }, 2000);
      }
    },
    handleCloseChangePassword(){
      this.oldPassword= null
      this.verifyPassword= null
      this.newPassword= null
      this.toggle('home')
    },
  },
  watch: {
    oldPassword(newValue) {
      if(newValue!==null){
        this.checkForm(newValue, "oldPassword");
      }
    },
    newPassword(newValue) {
      if(newValue!==null){
        this.checkForm(newValue, "newPassword");
      }
    },
    verifyPassword(newValue) {
      if(newValue!==null){
        this.checkForm(newValue, "verify");
      }
    },
  },
};
</script>

<style scoped>
.manage-user {
  background: #f2f2f2;
  min-height: 300px;
  display: flex;
  align-items: center;
  padding-bottom: 20px;
}
.active {
  color: red;
}
.user {
  padding: 0 15px 10px 15px;
  background: #fff;
  box-shadow: 0 2px 2px #ccc;
}
.img {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px 0;
}
.img span {
  background: rgb(223, 141, 17);
  width: 60px;
  line-height: 60px;
  text-align: center;
  border-radius: 50%;
  color: #fff;
  font-weight: 500;
}
.user-text {
}
.user-text:hover {
  color: red;
  cursor: pointer;
}
.list {
  list-style-type: none;
}
.list-item {
  display: block;
  background: #fff;
  margin: 8px 0;
  padding: 0 15px;
  line-height: 44px;
  box-shadow: 0 2px 2px #ccc;
}
.list-item:hover {
  color: red;
  cursor: pointer;
}
.home {
}
.info-user {
  background: #fff;
  padding: 16px 8px;
  border-radius: 4px;
}
.title {
  margin-bottom: 20px;
  font-size: 18px;
  display: block;
}
.info-title {
  display: flex;
  justify-content: space-between;
}
.info-title span + span {
  color: blue;
  cursor: pointer;
}
.info-content {
  margin: 12px 0;
}
.info-content:last-child {
  margin-bottom: 0;
}
.order {
}
table,
th,
tr,
td {
  border: 1px solid #ccc;
  background: #fff;
}
table {
  border-collapse: collapse;
  width: 100%;
}
th,
td {
  padding: 6px 0;
  font-weight: 400;
  text-align: center;
}
th:nth-child(1),
td:nth-child(1n) {
  width: 40%;
}
th:nth-child(2),
th:nth-child(3),
th:nth-child(4),
td:nth-child(2n),
td:nth-child(3n),
td:nth-child(4n) {
  width: 20%;
}
.link {
  color: blue;
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