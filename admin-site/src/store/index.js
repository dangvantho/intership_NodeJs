import Vue from "vue";
import Vuex from "vuex";
import user from "./modules/user";
import ticket from "./modules/ticket";
import airline from "./modules/airline";
import booking from "./modules/booking";
import statistic from "./modules/statistic";

Vue.use(Vuex);

const storeData = {
  modules: {
    user,
    ticket,
    airline,
    booking,
    statistic,
  },
  state: {
    fetchData: {
      pending: false,
      done: false,
    },
    verify: {
      err: null,
      message: null,
    },
    currentPage: 1
  },
  getters: {
    verify: (state) => state.verify,
    currentPage: state=>state.currentPage,
    fetchStatus: state=> state.fetchData
  },
  mutations: {
    PENDING: (state) => {
      state.fetchData.pending = true;
      state.fetchData.done = false;
    },
    FETCH_DONE: (state) => {
      state.fetchData.pending = false;
      state.fetchData.done = true;
    },
    VERIFY: (state, payload) => {
      state.verify = payload;
    },
    RESET: (state) => {
      state.fetchData = { pending: false, done: false };
      state.verify = { err: null, message: null };
    },
    SET_PAGE: (state, payload)=>{
      let page
      switch(payload){
        case '/user/profile':
          page=0
          break
        case '/':
          page=1
          break
        case '/admin/manage-category':
          page=2
          break
        case '/admin/manage-ticket':
          page=3
          break
        case '/admin/verify-order' :
          page=4
          break      
        default:
          page=5
          break  
      }
      state.currentPage= page
    }
  },
  actions: {},
};

const store = new Vuex.Store(storeData);

export default store;
