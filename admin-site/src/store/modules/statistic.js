import axios from "../../config/api";
const baseUrl = "http://localhost:3020/api/statistic";

const state = {
  statistic: {
    airlines: [],
    seats: [],
  },
};
const getters = {
  statisticAirlines: (state) => state.statistic.airlines,
  statisticSeats: (state) => state.statistic.seats,
};

const mutations = {
  SET_STATISTIC_AIRLINES: (state, payload) => {
    state.statistic.airlines = payload;
  },
  SET_STATISTIC_SEATS: (state, payload) => {
    state.statistic.seats = payload;
  },
};

const actions = {
  async fetchStatisticAirlines({ commit }, data) {
    commit("PENDING");
    const res = await Promise.all(
      data.map((id) => {
        return axios
          .get(`${baseUrl}/airlines/${id}`)
          .then((value) => value.data);
      })
    ).catch((err) => {
      err;
    });
    commit("FETCH_DONE");
    if (res.err) {
      console.log(res);
      return { err: res.err };
    } else {
      commit("SET_STATISTIC_AIRLINES", res);
    }
  },
  async fetchStatisticSeats({ commit }, data) {
    commit("PENDING");
    const res = await Promise.all(
      data.map((id) => {
        return axios.get(`${baseUrl}/seats/${id}`).then((value) => value.data);
      })
    ).catch((err) => {
      err;
    });
    commit("FETCH_DONE");
    if (res.err) {
      console.log(res);
      return { err: res.err };
    } else {
      commit("SET_STATISTIC_SEATS", res);
    }
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
