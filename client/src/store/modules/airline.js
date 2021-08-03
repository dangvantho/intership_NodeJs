import axios from "../../config/api";
const baseUrl = "http://localhost:3010/api";
const state = {
  airlines: [],
  seats: [],
  locations: [],
};
const getters = {
  airlines(state) {
    console.log(state.airlines, "airline");
    return state.airlines;
  },
  seats(state) {
    return state.seats;
  },
  locations(state) {
    return state.locations;
  },
};
const mutations = {
  SET_AIRLINES: (state, payload) => {
    const [airlines, seats, locations] = payload;
    state.airlines = airlines.data;
    state.seats = seats.data;
    state.locations = locations.data;
  },
  ADD_CATEGORY: (state, payload) => {
    const { type, data } = payload;
    console.log(payload);
    state[type].push(data);
  },
  DELETE_CATEGORY: (state, payload) => {
    const { type, id } = payload;
    console.log(type, id);
    state[type] = state[type].filter((value) => value.id !== id);
  },
  CHANGE_CATEGORY: (state, payload) => {
    const { type, data } = payload;
    console.log(payload);
    state[type] = state[type].map((value) => {
      if (value.id === data.id) value.name = data.name;
      return value;
    });
  },
};
const actions = {
  async fetchAirlines({ commit }) {
    commit("PENDING");
    const fetch = (link) => axios.get(link);
    Promise.allSettled([
      fetch(`${baseUrl}/airlines/all`),
      fetch(`${baseUrl}/seats/all`),
      fetch(`${baseUrl}/locations/all`),
    ])
      .then((values) => {
        return values.map((value) => value.value);
      })
      .then((data) => {
        commit("FETCH_DONE");
        commit("SET_AIRLINES", data);
      })
      .catch((err) => {
        return { err };
      });
  },
  async addCategory({ commit }, form) {
    commit("PENDING");
    const res = await axios
      .post(`${baseUrl}/${form.link}`, form.data)
      .catch((err) => err);
    commit("FETCH_DONE");
    let { err, message, data } = res;
    if (err) {
      return err;
    } else {
      console.log(data, message);
      commit("ADD_CATEGORY", { type: form.link, data });
      return message;
    }
  },
  async deleteCategory({ commit }, { id, link }) {
    commit("PENDING");
    const res = await axios
      .delete(`${baseUrl}/${link}/${id}`)
      .catch((err) => err);
    commit("FETCH_DONE");
    const { err, message } = res;
    if (err) {
      return { err };
    } else {
      commit("DELETE_CATEGORY", { type: link, id });
      return { message };
    }
  },
  async changeCategory({ commit }, { link, id, name }) {
    commit("PENDING");
    const res = await axios
      .put(`${baseUrl}/${link}/${id}`, { name })
      .catch((err) => {
        err;
      });
    commit("FETCH_DONE");
    const { err, message } = res;
    if (err) {
      return { err };
    } else {
      let data = { id, name };
      commit("CHANGE_CATEGORY", { type: link, data });
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
