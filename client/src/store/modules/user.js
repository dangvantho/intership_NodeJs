import axios from "../../config/api";

const baseUrl = "http://localhost:3005/api/users";

const state = {
  user: {
    name: null,
    id: null,
    email: null,
  },
};
const getters = {
  user: (state) => {
    return state.user;
  },
};
const mutations = {
  SET_USER: (state, payload) => {
    const { name, id, email } = payload;
    console.log(payload, " payload", state);
    state.user = { name, id, email };
  },
  LOG_OUT: (state) => {
    localStorage.removeItem("accesstoken");
    localStorage.removeItem("refreshtoken");
    localStorage.removeItem("expire_at");
    state.user = { name: null, id: null, email: null };
  },
  CHANGE_INFOR: (state, payload)=>{
    const { name, email}= payload
    state.user.name= name
    state.user.email= email
  }
};

const actions = {
  async login({ commit }, data) {
    const res = await axios.post(`${baseUrl}/login`, data).catch((err) => err);
    const { err, user } = res;
    console.log(res);
    if (err) {
      return { err: "Sai mật khẩu hoặc email" };
    } else {
      commit("SET_USER", user);
      return { messege: "Login thành công" };
    }
  },
  async auth({ commit }) {
    const accesstoken = localStorage.getItem("accesstoken");
    const refreshtoken = localStorage.getItem("refreshtoken");
    if (accesstoken || refreshtoken) {
      const res = await axios
        .get(`${baseUrl}/authozication`)
        .catch((err) => err);
      const { err, user } = res;
      if (!err) {
        commit("SET_USER", user);
        return { message: "Đăng nhập thành công" };
      } else {
        localStorage.removeItem("accesstoken");
        localStorage.removeItem("refreshtoken");
        localStorage.removeItem("expire_at");
        return { err };
      }
    } else {
      return { err: "Không có tài khoản" };
    }
  },
  async register({ commit }, data) {
    commit("PENDING");
    const res = await axios
      .post(`${baseUrl}/register`, data)
      .catch((err) => err);
    const { err, messege } = res;
    commit("FETCH_DONE");
    if (err) {
      return { err };
    } else return { messege };
  },
  async resetPassword({ commit }, data) {
    const res = await axios.put(`${baseUrl}/reset-password`, data);
    const { err, message } = res;
    commit("VERIFY", { err, message });
    console.log(commit, data, res);
    return res;
  },
  async changePassword({ commit }, data) {
    commit("PENDING");
    const res = await axios.put(`${baseUrl}/user/password`, data);
    commit("FETCH_DONE");
    const { err, message } = res;
    console.log(res);
    // commit('VERIFY',{err, message})
    if (err) {
      return { err };
    } else {
      return { message };
    }
  },
  async changeInformationUser({commit}, data){
    const res = await axios.put(`${baseUrl}/change-information`, data);
    const { err, message } = res;
    if(err){
      return { err }
    }
    commit("CHANGE_INFOR", data );
    return { message }
  }
};
export default {
  state,
  getters,
  mutations,
  actions,
};
