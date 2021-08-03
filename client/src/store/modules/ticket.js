import axios from "../../config/api";
const baseUrl = "http://localhost:3015/api/flights";
const baseUrlBooking = "http://localhost:3015/api/booking";

const formatTime = (time) => {
  let [t1, t2] = time.split(":");
  return `${t1}:${t2}`;
};
const formatDate= date=>{
  const time= new Date(date)
  const formatDay= day=>{
    const tam= ('0'+day).split('')
    const length= tam.length
    return tam[length-2]+tam[length-1]
  }
  const day= formatDay(time.getDate()),
        month= formatDay(time.getMonth() + 1),
        year= time.getFullYear();
  return `${month}/${day}/${year}`      
}
const state = {
  flights: {
    search: [],
    filter: [],
    user_orders: [],
  },
  query:{
    _from: null,
    _to: null,
    weekday: null,
  },
};
const getters = {
  filterflights: (state) => {
    console.log(state.flights)
    return state.flights.filter
  },
  user_orders: (state) => {
    const list = state.flights.user_orders;
    return list.map((item) => {
      item.create_at = formatTime(item.create_at);
      return item;
    });
  },
  query: state=> state.query
};
const mutations = {
  SEARCH_TICKET: (state, payload) => {
    const searchFlight= payload.map(flight=>{
      flight.flight._start = formatTime(flight.flight._start);
      flight.flight._end = formatTime(flight.flight._end);
      flight.flight.date_start= formatDate(flight.flight.date_start)
      flight.flight.date_end= formatDate(flight.flight.date_end)
      return flight
    })
    state.flights.filter = searchFlight;
    state.flights.search = searchFlight;
  },
  SET_USER_ORDERS: (state, payload) => {
    state.flights.user_orders = payload;
  },
  FILTER_FLIGHT: (state, payload) => {
    let { time, airlines } = payload;
    let time_left, time_right;
    if (time) {
      time_left = time.split("-")[0];
      time_right = time.split("-")[1];
      time_left = new Date(`2021,1,1 ${time_left}:0:0`);
      time_right = new Date(`2021,1,1 ${time_right}:0:0`);
    }
    let newFilter = [...state.flights.search];
    newFilter = newFilter.filter((ticket) => {
      if (!airlines.includes(ticket.flight.airline)) {
        return false;
      }
      if (time) {
        let hour1 = new Date(`2021,1,1 ${ticket.flight._start}`);
        let hour2 = new Date(`2021,1,1 ${ticket.flight._end}`)
        if (time_left > hour1 || time_right < hour2) {
          return false;
        }
      }
      return true;
    });
    state.flights.filter = newFilter;
  },
  SORT_TICKET: (state, payload) => {
    const {  _time } = payload;
    if (_time) {
        state.flights.filter.sort((ticket1,ticket2)=>{
        let hour1 = new Date(`2021,1,1 ${ticket1.flight._start}`);
        let hour2 = new Date(`2021,1,1 ${ticket2.flight._start}`);
        if(_time=='dsc' || _time=='DSC'){
          return hour2 -hour1
        }else{
          return hour1- hour2
        }
      })
    }
  },
  SET_QUERY: (state, payload)=>{
    state.query= {...state.query, ...payload}
  },
  RESET_QUERY: state=>{
    state.query= {
      _from: null,
      _to: null,
      weekday: null,
      day: null,
    }
  }
};

const actions = {
  // Tìm kiếm
  async searchflights({ commit }, form) {
    commit("PENDING");
    const res = await axios
      .get(`${baseUrl}/filter`, { params: form })
      .catch((err) => err);
    commit("FETCH_DONE");  
    const { err, data } = res;
    console.log(res, 'ticket')
    if (err) {
      return { err };
    } else {
      commit("SEARCH_TICKET", data);
      commit("SORT_TICKET", { _time: "ASC" });
    }
  },
  // Lấy toàn bộ đơn hàng của người dùng
  async fetchOrders({ commit }, params) {
    commit("PENDING");
    const res = await axios
      .get(`${baseUrlBooking}/user`, { params })
      .catch((err) => err);
    commit("FETCH_DONE");

    const { data, err } = res;
    if (err) {
      return { err };
    } else {
      commit("SET_USER_ORDERS", data);
      return {};
    }
  },
};
export default {
  state,
  getters,
  mutations,
  actions,
};
