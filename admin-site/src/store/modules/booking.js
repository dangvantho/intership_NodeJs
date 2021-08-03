import axios from "../../config/api";
const baseUrl = "http://localhost:3015/api/booking";
const formatTime = (time, type) => {
  const format = (t) => {
    t = ("0" + t).split("");
    let length = t.length;
    return t[length - 2] + t[length - 1];
  };
  const date = new Date(time);
  const day = format(date.getDate()),
    month = format(date.getMonth() + 1),
    year = date.getFullYear(),
    hour = format(date.getHours()),
    minutes = format(date.getMinutes());
  //Đầu ra kiểu Ngày tháng năm
  if(type===1){
    return `${day}/${month}/${year}`
  }  
  return `${day}/${month}/${year} ${hour}:${minutes}`;
};
const state = {
  order: {},
  allOrders: [],
  orderNotVerify: [],
};
const mutations = {
  SET_ORDER: (state, payload) => {
    payload.create_at = formatTime(payload.create_at);
    payload.date_flight = formatTime(payload.date_flight, 1)
    state.order = payload;
  },
  SET_ALL_ORDER: (state, payload) => {
    let newValues = payload.map((order) => {
      order.create_at = formatTime(order.create_at);
      order.date_flight = formatTime(order.date_flight, 1)
      return order;
    });
    state.allOrders.push(...newValues)
  },
  SET_ORDER_NOT_VERIFY: (state, payload)=>{
    let newValues = payload.map((order) => {
      order.create_at = formatTime(order.create_at);
      order.date_flight = formatTime(order.date_flight, 1)
      return order;
    });
    state.orderNotVerify= newValues
  },
  DELETE_ORDER_NOT_VERIFY: (state, payload)=>{
    let newValue= [...state.orderNotVerify]
    let index = newValue.findIndex(order=>order.id===payload)
    if(index===-1) return
    state.allOrders.push(newValue[index])
    newValue.splice(index,1)
    console.log(newValue)
    state.orderNotVerify= [...newValue]
  }
};
const getters = {
  order: (state) => state.order,
  allOrders: (state) => state.allOrders,
  orderNotVerify: state=>state.orderNotVerify,
};
const actions = {
  async fetchOrder({ commit }, id) {
    commit("PENDING");
    const res = await axios.get(`${baseUrl}/${id}`).catch((err) => {
      err;
    });
    commit("FETCH_DONE");
    const { err, data } = res;
    if (err) {
      
      return { err };
    } else {
      commit("SET_ORDER", data);
      return { message: "Lấy dữ liệu thành công" };
    }
  },
  async fetchAllOrders({ commit }, params) {
    commit("PENDING");
    const res = await axios.get(`${baseUrl}/all`, { params }).catch((err) => {
      err;
    });
    commit("FETCH_DONE");
    console.log(res)
    if (res.err || res.data.length===0) {
      return { err: "Nhận dữ liệu bị lỗi" };
    } else {
      commit("SET_ALL_ORDER", res.data);
      return { message: "Get ticket thành công" };
    }
  },
  async fetchOrderNotVerify({commit}){
    commit("PENDING");
    const res = await axios.get(`${baseUrl}/not-verify`).catch((err) => {
      err;
    });
    commit("FETCH_DONE");
    if(res.err){
      return { err: res.err}
    }
    commit('SET_ORDER_NOT_VERIFY', res.data)
    return true
  },
  async verify({commit}, {id, email}){
    commit("PENDING");
    const res = await axios.put(`${baseUrl}/verify/${id}`, {email}).catch((err) => {
      err;
    });
    commit("FETCH_DONE");
    if(res.err){
      return { err: res.err}
    }
    commit('DELETE_ORDER_NOT_VERIFY', id)
    return true
  }
};
export default {
  state,
  getters,
  actions,
  mutations,
};
