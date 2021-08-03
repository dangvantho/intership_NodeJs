import axios from "../../config/api";
const baseUrl = "http://localhost:3015/api/flights";
// const baseUrlBooking = "http://localhost:3015/api/booking";

const formatTime = (time) => {
  let [t1, t2] = time.split(":");
  return `${t1}:${t2}`;
};
const formatDate = (date) => {
  const time = new Date(date);
  const formatDay = (day) => {
    const tam = ("0" + day).split("");
    const length = tam.length;
    return tam[length - 2] + tam[length - 1];
  };
  const day = formatDay(time.getDate()),
    month = formatDay(time.getMonth() + 1),
    year = time.getFullYear();
  return `${month}/${day}/${year}`;
};
const findLocation= (id, locations)=>{
  const location= locations.find(value=>value.id==id)
  if(location) return location.name
  return ''
}
const findAirline= (id, airlines)=>{
  const airline= airlines.find(value=>value.id===id)
  if(airline) return airline.name
  return ''
}
const state = {
  tickets: {
    all: [],
    search: [],
  },
};
const mutations = {
  SET_ALL_TICKETS: (state, payload) => {
    state.tickets.all = payload.map((flight) => {
      flight.flight._start = formatTime(flight.flight._start);
      flight.flight._end = formatTime(flight.flight._end);
      flight.flight.date_start = formatDate(flight.flight.date_start);
      flight.flight.date_end = formatDate(flight.flight.date_end);
      return flight;
    });
  },
  POST_TICKET: (state, payload) => {
    const {flight, flight_seat, locations, airlines}= payload
    console.log(flight)
    flight._start = formatTime(flight._start);
    flight._end = formatTime(flight._end);
    flight.date_start = formatDate(flight.date_start);
    flight.date_end = formatDate(flight.date_end);
    flight._from= findLocation(flight._from, locations)
    flight._to= findLocation(flight._to, locations)
    flight.airline= findAirline(flight.airline, airlines)
    state.tickets.all.push({flight, flight_seat});
  },
  CHANGE_TICKET: (state, payload) => {
    state.tickets.all = state.tickets.all.map((value) => {
      if (value.flight.id === payload.flight.id) {
        value.flight.isdelete = payload.flight.isdelete;
        value.flight_seat = [...payload.flight_seat];
      }
      return value;
    });
  },
  DELETE_TICKET: (state, payload) => {
    const { id } = payload;
    state.tickets.all = state.tickets.all.filter((value) => value.id !== id);
  },
};
const getters = {
  allTickets: (state) => state.tickets.all,
};
const actions = {
  // Lây toàn bộ ticket
  async fetchTickets({ commit }, params) {
    commit("PENDING");
    const res = await axios
      .get(`${baseUrl}/all`, { params })
      .catch((err) => err);
    const { err, data } = res;
    commit("FETCH_DONE");
    if (err) {
      return { err };
    } else {
      commit("SET_ALL_TICKETS", data);
    }
  },
  // Thêm vé mới
  async postTicket({ commit, rootState }, form) {
    commit("PENDING");
    const res = await axios.post(`${baseUrl}`, form).catch((err) => {
      err;
    });
    commit("FETCH_DONE");
    const { err, data, message } = res;
    if (err) {
      return { err };
    } else {
      const {airlines, locations}= rootState.airline
      const {flight, flight_seat}= data
      commit("POST_TICKET", {
        flight,
        flight_seat,
        airlines,
        locations
      });
      return { message };
    }
  },
  //Thay đổi
  async changeTicket({ commit }, data) {
    commit("PENDING");
    const res = await axios
      .put(`${baseUrl}/${data.flight.id}`, data)
      .catch((err) => {
        err;
      });
    commit("FETCH_DONE");
    const { err, message } = res;
    if (err) {
      return { err };
    } else {
      commit("CHANGE_TICKET", data);
      return { message };
    }
  },
  // Xóa vé máy bay
  async deleteTicket({ commit }, id) {
    commit("PENDING");
    const res = await axios.delete(`${baseUrl}/${id}`).catch((err) => {
      err;
    });
    commit("FETCH_DONE");
    const { err, message } = res;
    if (err) {
      return { err };
    } else {
      commit("DELETE_TICKET", { id });
      return { message };
    }
  },
};
export default {
  state,
  getters,
  mutations,
  actions,
};
