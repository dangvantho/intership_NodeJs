import axios from "../../config/api";

const baseUrl = "http://localhost:3005/api/admin";
// const baseUrlUser= 'http://localhost:3005/api/user'

const state = {
  user: {
    name: null,
    id: null,
    email: null,
  },
  allAdmin:[],
};
const getters = {
  user: (state) => {
    return state.user;
  },
  allAdmin: state=> state.allAdmin
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
    state.allAdmin=[]
  },
  SET_ALL_ADMIN: (state, payload)=>{
    state.allAdmin= payload
  },
  DELETE_ADMIN: (state, payload)=>{
    state.allAdmin= state.allAdmin.filter(user=> user.id!== payload)
  }, 
  POST_ADMIN: (state, payload)=>{
    state.allAdmin.push(payload)
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
    commit("FETCH_DONE");
    if (res.err) {
      return { err: res.err };
    }
    console.log(res)
    commit('POST_ADMIN', res.data)
    return { message : res.message}
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
    const res = await axios.put(`${baseUrl}/change-password`, data);
    commit("FETCH_DONE");
    const { err, message } = res;
    // commit('VERIFY',{err, message})
    if (err) {
      return { err };
    } else {
      return { message };
    }
  },
  async fetchAllAdmin({commit}){
    commit('PENDING')
    const res= await axios.get(`${baseUrl}/all`).catch(err=>{ err })
    commit('FETCH_DONE')
    if(res.err){
      return {err: res.err}
    }
    commit('SET_ALL_ADMIN', res.data)
    return { message: 'Done'}
  },
  async deleteAdmin({commit}, id){
    commit('PENDING')
    const res= await axios.delete(`${baseUrl}/${id}`)
    commit('FETCH_DONE')
    if(res.err){
      return { err: res.err}
    }
    commit('DELETE_ADMIN', id)
    return {message: res.message}
  },
  async changeInformationUser({commit}, data){
    commit('PENDING')
    const res = await axios.put(`${baseUrl}/change-information`, data);
    commit('FETCH_DONE')
    const { err, message } = res;
    if(err){
      return { err }
    }
    commit("CHANGE_INFOR", data );
    return { message }
  },
};
export default {
  state,
  getters,
  mutations,
  actions,
};
