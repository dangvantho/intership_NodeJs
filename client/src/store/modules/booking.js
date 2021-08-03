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
  booking: {
    ticket: {},
    customers: [],
    contact: {},
  },
  order: {},
  allOrders: [],
};
const mutations = {
  SET_BOOKING_STORAGE: (state) => {
    const ticket = JSON.parse(localStorage.getItem("ticket")) || {};
    const customers = JSON.parse(localStorage.getItem("customers")) || [];
    const contact = JSON.parse(localStorage.getItem("contact")) || {};
    state.booking = { ticket, customers, contact };
  },
  SET_BOOKING_TICKET: (state, payload) => {
    if (payload) {
      localStorage.removeItem("contact");
      localStorage.removeItem("customers");
      localStorage.removeItem("ticket");
      state.booking.ticket = payload;
      localStorage.setItem("ticket", JSON.stringify(payload));
    }
  },
  SET_CUSTOMER: (state, payload) => {
    if (payload) {
      const { index, value } = payload;
      if (!state.booking.customers) {
        state.booking.customers = [];
      }
      state.booking.customers[index] = value;
      localStorage.setItem(
        "customers",
        JSON.stringify(state.booking.customers)
      );
    }
  },
  SET_CONTACT: (state, payload) => {
    if (payload) {
      state.booking.contact = payload;
      localStorage.setItem("contact", JSON.stringify(payload));
    }
  },
  DELETE_BOOKING: (state) => {
    state.booking = {
      ticket: {},
      customers: [],
      contact: {},
    };
    localStorage.removeItem("contact");
    localStorage.removeItem("customers");
    localStorage.removeItem("ticket");
  },
  SET_ORDER: (state, payload) => {
    payload.create_at = formatTime(payload.create_at);
    payload.date_flight = formatTime(payload.date_flight, 1)
    state.order = payload;
  },
  SET_ALL_ORDER: (state, payload) => {
    state.allOrders = payload.map((order) => {
      order.create_at = formatTime(order.create_at);
      order._time = formatTime(order._time);
      return order;
    });
    console.log(state.allOrders);
  },
  DELETE_ORDER: (state, payload)=>{
    state.allOrders= state.allOrders.filter(value=>{
      return value.id !== payload
    })
    state.order= {}
  }
};
const getters = {
  bookingTicket: (state) => state.booking.ticket,
  bookingCustomers: (state) => state.booking.customers,
  bookingContact: (state) => state.booking.contact,
  order: (state) => state.order,
  allOrders: (state) => state.allOrders,
};
const actions = {
  async bookTicket({ commit }, payload) {
    commit("PENDING");
    const res = await axios.post(`${baseUrl}`, payload);
    commit("FETCH_DONE");
    const { message, err, clientId } = res;
    if (err) {
      return { err };
    } else {
      commit("DELETE_BOOKING");
      if (clientId) {
        localStorage.setItem("clientId", clientId);
      }
      return { message };
    }
  },
  async verifyBooking({ commit }, id) {
    commit("PENDING");
    const res = await axios.get(`${baseUrl}/verify/${id}`);
    commit("FETCH_DONE");
    const { err, message } = res;
    if (err) return { err };
    else {
      return { message };
    }
  },
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
    if (res.err) {
      return { err: res.err };
    } else {
      commit("SET_ALL_ORDER", res.data);
      return { message: "Get ticket thành công" };
    }
  },
  async deleteOrder({commit}, id){
    commit('PENDING')
    const res=await axios.delete(`${baseUrl}/${id}`).catch(err=>{ err })
    commit('FETCH_DONE')
    const {err, message}= res
    console.log(res, 'delete')
    if(err){
      return { err }
    }else{
      commit('DELETE_ORDER', id)
      return { message }
    }
  }
};
export default {
  state,
  getters,
  actions,
  mutations,
};
