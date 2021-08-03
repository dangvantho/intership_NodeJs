import Vue from "vue";
import Vuex from "vuex";
import user from "./modules/user";
import ticket from "./modules/ticket";
import airline from "./modules/airline";
import booking from "./modules/booking";

Vue.use(Vuex);

const storeData = {
  modules: {
    user,
    ticket,
    airline,
    booking,
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
  },
  getters: {
    verify: (state) => state.verify,
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
  },
  actions: {},
};

const store = new Vuex.Store(storeData);

export default store;
