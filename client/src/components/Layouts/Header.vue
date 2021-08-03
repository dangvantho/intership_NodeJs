<template>
  <div>
    <div class="header-top d-none d-sm-block">
      <div class="container" style="height: 100%">
        <div class="row justify-content-between align-items-center">
          <div class="col-4">
            <i class="ti ti-time icon"></i>
            <span class="">0h-24h</span>
            <a href="#">
              <i class="ti ti-facebook icon"></i>
            </a>
          </div>
          <div class="col-8 d-flex justify-content-end">
            <span
              class="login"
              v-if="!user.name"
              @click="openLogin = !openLogin"
              >Đăng nhập</span
            >
            <span v-else>
              <router-link to="/user/profile" class="login">
                <i class="ti ti-user"></i>
                <span style="color: black; padding-left: 8px">Xin chào! </span>
                {{ user.name }}
                <span class="ms-3" @click="logout">Đăng xuất</span>
              </router-link>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="header-bottom">
      <div class="header_content">
        <div class="container">
          <div class="row justify-content-between">
            <div class="col-4 col-sm-4 col-md-3">
              <router-link to="/">
                <img class="img" :src="logoImg" alt="logo" />
              </router-link>
            </div>
            <div class="d-none d-md-block col col-md-8">
              <div class="d-flex align-items-center">
                <img :src="phoneImg" alt="clock" />
                <span class="contact">
                  Tổng đài đặt vé
                  <span>0327910404</span>
                </span>
              </div>
              <div class="d-flex align-items-center">
                <img :src="clockImg" alt="clock" />
                <span class="contact">
                  Giờ làm việc
                  <span>Tất cả các ngày trong tuần (24/7)</span>
                </span>
              </div>
            </div>
            <div class="d-flex d-md-none col-8 menu">
              <i class="ti ti-menu menu-icon" @click="navbar = !navbar"></i>
              <ul class="nav" v-show="navbar" @click="navbar = !navbar">
                <div class="nav-item" v-if="user.name !== 'admin'">
                  <li class="nav-item">
                    <router-link class="nav-link" to="/">Trang chủ</router-link>
                  </li>
                  <li class="nav-item">
                    <router-link class="nav-link" to="/order/search"
                      >Xem lại đơn hàng</router-link
                    >
                  </li>
                  <li class="nav-item">
                    <router-link class="nav-link" to="/search-ticket"
                      >Tìm vé</router-link
                    >
                  </li>
                  <li class="nav-item">
                    <router-link class="nav-link" to="/booking"
                      >Đặt vé</router-link
                    >
                  </li>
                  <li class="nav-item">
                    <div class="nav-link" @click="openLogin = !openLogin">
                      Đăng nhập/Đăng ký
                    </div>
                  </li>
                </div>

                <div v-if="user.name && user.name !== 'admin'" class="nav-item">
                  <li class="nav-item">
                    <router-link to="/user/profile" class="nav-link"
                      >Quản lý tài khoản</router-link
                    >
                  </li>
                </div>
                <div v-else-if="user.name === 'admin'" class="nav-item">
                  <li class="nav-item">
                    <router-link to="/user/profile" class="nav-link"
                      >Quản lý tài khoản</router-link
                    >
                  </li>
                  <li class="nav-item">
                    <router-link class="nav-link" to="/admin/manage-category">
                      Quản lý danh mục
                    </router-link>
                  </li>
                  <li class="nav-item">
                    <router-link class="nav-link" to="/admin/manage-ticket">
                      Quản lý thông tin vé
                    </router-link>
                  </li>
                  <li class="nav-item">
                    <router-link class="nav-link" to="/statistic">
                      Quản lý đặt vé
                    </router-link>
                  </li>
                </div>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Login v-if="openLogin" @toggleLogin="toggleLogin" />
    <register v-if="openRegister" @toggleRegister="toggleRegister(true)" />
    <Navbar />
  </div>
</template>

<script>
import logoImg from "../../assets/logo.png";
import clockImg from "../../assets/t_clock.png";
import phoneImg from "../../assets/t_phone.png";
import { mapGetters, mapMutations } from "vuex";
import Navbar from "../Navbar";
import Login from "../Login";
import Register from "../Register.vue";
export default {
  name: "Header",
  components: { Navbar, Login, Register, },
  created() {
    console.log("Created");

    // this.$store.dispatch("fetchflights");
    this.$store.dispatch("fetchAirlines");
  },
  mounted() {
    console.log("Mounted");
  },
  data() {
    return {
      logoImg,
      clockImg,
      phoneImg,
      openLogin: false,
      openRegister: false,
      navbar: false,
    };
  },
  computed: {
    ...mapGetters(["user"]),
  },
  methods: {
    ...mapMutations(["LOG_OUT"]),
    toggleLogin(openRegister) {
      this.openLogin = !this.openLogin;
      if (openRegister) this.openRegister = true;
      else this.openRegister = false;
    },
    toggleRegister(openLogin) {
      this.openRegister = !this.openRegister;
      if (openLogin) this.openLogin = true;
      else this.openLogin = false;
    },
    logout() {
      this.$router.push('/')
      this.LOG_OUT();
    },
  },
};
</script>

<style scoped>
.header-top {
  background: rgb(244 246 247);
  min-height: 25px;
}
a {
  text-decoration: none;
}
.icon {
  color: red;
}
.icon + span {
  padding: 0 8px;
  border-right: 1px solid #ccc;
  margin-right: 8px;
}
.menu {
  justify-content: flex-end;
  align-items: center;
  position: relative;
}
.menu-icon {
  color: red;
  font-weight: 600;
  font-size: 20px;
}
.menu-icon:hover {
  cursor: pointer;
}
.nav {
  position: absolute;
  z-index: 9;
  top: 66%;
  list-style: none;
  animation: show 0.3s ease-in;
  /* height: 150px; */
  overflow: hidden;
}
.nav-item {
  cursor: pointer;
}
.nav-link {
  background: #fff;
  display: block;
  text-align: center;
  padding: 8px 20px;
  border-bottom: 1px solid #ccc;
  color: dodgerblue;
}
.header-bottom {
  background: url(../../assets/bg_header.jpg) center / cover no-repeat;
  min-height: 100px;
  position: relative;
}
.header_content {
  position: absolute;
  top: 0;
  height: 100%;
  width: 100%;
  display: flex;
  /* justify-content: center; */
  align-items: center;
}
.img {
  object-fit: cover;
  height: 100%;
  max-height: 100%;
  display: block;
}
.contact {
  color: rgb(28, 85, 240);
  margin: 5px 10px;
  text-transform: uppercase;
}
.contact span {
  color: red;
  font-weight: 500;
  text-transform: none;
  padding-left: 10px;
}
.login {
  display: block;
  cursor: pointer;
  color: red;
}
@keyframes show {
  0% {
    height: 0;
  }
  25% {
    height: 25%;
  }
  50% {
    height: 50%;
  }
  75% {
    height: 75%;
  }
  100% {
    height: 100%;
  }
}
</style>