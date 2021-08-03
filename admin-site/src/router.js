import store from "./store/index";
import Vue from "vue";
import Router from "vue-router";
// import Home from "./components/Home/Home.vue";
import User from "./components/User/User.vue";
import ResetPassword from "./components/User/ResetPassword";
import ManageCategory from "./components/ManageCategory/ManageCategory";
import ManageTicket from "./components/ManageTicket/ManageTicket";
import Order from "./components/Order/Order";
import Statistic from "./components/Statistic/Statistic";
import Login from './components/Login.vue'
import VerifyOrder from './components/VerifyOrder/VerifyOrder'

Vue.use(Router);

const router = new Router({
  mode: "history",
  // base:"http://localhost:8080",
  routes: [
    {
      path:'/login',
      component: Login,
    },
    {
      path: "/user/reset-password",
      component: ResetPassword,
      meta: { auth: true},
    },
    {
      path: "/user/profile",
      component: User,
      meta: { auth: true },
    },
    {
      path: "/admin/manage-category",
      component: ManageCategory,
      name: "manage category",
      meta: { auth: true },
    },
    {
      path: "/admin/manage-ticket",
      component: ManageTicket,
      meta: { auth: true },
    },
    {
      path: "/order/search/:id",
      meta: { auth: true},
      component: Order,
    },
    {
      path:'/admin/verify-order',
      component: VerifyOrder,
      meta: { auth: true}
    },
    {
      path: "/",
      component: Statistic,
      meta: { auth: true },
    },
  ],
});
router.beforeEach(async (to, from, next) => {
  let routerAuthCheck = store.state.user.user.id;
  console.log( to.fullPath)
  store.commit('SET_PAGE', to.fullPath)
  // Kiểm tra có tài khoản và có token chưa
  let data
  if (!routerAuthCheck) {
    data= await store.dispatch("auth");
    console.log(data)
  }
  console.log(routerAuthCheck)
  if(to.matched.some(record=>record.meta.auth)){
    if(routerAuthCheck || !data.err){
      next()
    } else{
      router.replace('/login')
    }
  } else{
    next()
  }
});

export default router;
