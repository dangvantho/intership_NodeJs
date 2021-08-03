<template>
  <div class="navbar">
    <div class="container">
      <div class="d-none d-md-block bg">
        <ul class="nav">
          <li class="nav-item">
            <router-link class="nav-link" to="/">Trang chủ</router-link>
          </li>
          <div v-if="user.name !== 'admin'" class="nav-item">
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
              <router-link class="nav-link" to="/booking">Đặt vé</router-link>
            </li>
          </div>
          <div class="nav-item" v-else>
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
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Navbar",
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["user"]),
  },
};
</script>

<style scoped>
.navbar {
  background: #00aeef;
}
.nav {
  list-style: none;
}
.nav-item {
  display: inline-block;
}
.nav-link {
  line-height: 50px;
  padding: 0 16px;
  text-transform: uppercase;
  font-weight: 600;
  color: #fff;
  text-decoration: none;
  display: block;
}
.nav-link:hover {
  background: #0091c7;
}
</style>