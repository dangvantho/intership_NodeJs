import store from "./store/index";
import Vue from "vue";
import Router from "vue-router";
import Home from "./components/Home/Home.vue";
import User from "./components/User/User.vue";
import SearchTicket from "./components/SearchTicket/SearchTicket.vue";
import Booking from "./components/Booking/Booking";
import Booking404 from "./components/Booking/Booking404";
import VerifyBooking from "./components/Verify/VerifyBooking";
import Order from "./components/Order/Order";
import SearchOrder from "./components/Order/Search";
import ResetPassword from './components/User/ResetPassword.vue'

Vue.use(Router);

const router = new Router({
  mode: "history",
  // base:"http://localhost:8080",
  routes: [
    {
      path: "/search-ticket",
      component: SearchTicket,
      name: "search ticket",
    },
    {
      path: "/user/profile",
      component: User,
      name: "user",
      meta: { auth: true },
    },
    { path: "/", 
      component: Home, 
      name: "home" 
    },
    {
      path: "/booking",
      component: Booking,
    },
    {
      path: "/booking/404",
      component: Booking404,
    },
    {
      path: "/booking/verify/:id",
      component: VerifyBooking,
    },
    {
      path: "/order/search",
      component: SearchOrder,
    },
    {
      path: "/order/search/:id",
      component: Order,
    },
    {
      path: "/reset-password",
      component: ResetPassword,
    },
  ],
});
router.beforeEach(async (to, from, next) => {
  let routerAuthCheck = store.state.user.user.id;
  store.commit("SET_BOOKING_STORAGE");
  // Xóa tài khoản tạm thời khi người dùng đăng nhập
  let clientId = localStorage.getItem("clientId");
  if (routerAuthCheck !== clientId && routerAuthCheck)
    localStorage.removeItem("clientId");
  // Kiểm tra có tài khoản và có token chưa
  if (!routerAuthCheck) {
    await store.dispatch("auth");
  }
  if (to.matched.some((record) => record.meta.auth)) {
    if (routerAuthCheck) {
      // user is Authenticated - allow access
      next();
    } else {
      router.replace("/");
      // user is not authenticated - redirect to login
    }
  } 
  // Allow page to load
  else {
    next();
  }
});

export default router;
