<template>
  <div class="statistic">
    <div class="title">Thống kê vé đã đặt</div>
    <div class="d-flex justify-content-center">
      <div class="btn" @click="handleAirline">Hãng hàng không</div>
      <div class="btn" @click="handleSeat">Loại ghế</div>
    </div>
    <div class="container">
      <div class="row">
        <div class="col-8 d-flex justify-content-center">
          <bar-chart
            class="char"
            :chartdata="datasetAirlines"
            v-if="loadedAirline"
          />
          <Chart class="char" :chartdata="datasetSeats" v-if="loadedSeat" />
        </div>
        <div class="col-4" v-show="loadedAirline">
          <div class="nav-title">Xem chi tiết</div>
          <div
            class="nav-item"
            v-for="(airline, i) in statisticAirlines"
            :key="airline.id"
            @click="() => changeIndex(i)"
          >
            <p>{{ getName(airline, 'airline') }}</p>
            <div v-if="index === i">
              <div
                class="text"
                v-for="value in airline.data"
                :key="value.ticket_id"
                @click="() => handleViewOrder(value.ticket_id)"
              >
                {{ value.ticket_id }}
              </div>
            </div>
          </div>
        </div>
        <div class="col-4" v-show="loadedSeat">
          <div class="nav-title">Xem chi tiết</div>
          <div
            class="nav-item"
            v-for="(seat, i) in statisticSeats"
            :key="seat.id"
            @click="() => changeIndex(i)"
          >
            <p>{{ getName(seat, 'seat') }}</p>
            <div v-if="index === i">
              <div
                class="text"
                v-for="value in seat.data"
                :key="value.ticket_id"
                @click="() => handleViewOrder(value.ticket_id)"
              >
                {{ value.ticket_id }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <loading/>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import BarChart from "./Bar.vue";
import Chart from "./Chart.vue";
import Loading from '../Loading.vue'
export default {
  name: "Statistic",
  components: { BarChart, Chart, Loading },
  async created() {
    await this.setValue();
  },
  data() {
    return {
      loadedAirline: false,
      loadedSeat: false,
      index: 0,
    };
  },
  computed: {
    ...mapGetters(["airlines", "seats", "statisticAirlines", "statisticSeats"]),
    datasetAirlines() {
      return {
        labels: this.statisticAirlines.map((value) => {
          return value.name 
        }),
        datasets: [
          {
            label: "Airlines",
            backgroundColor: "#f87979",
            data: this.statisticAirlines.map((value) => value.count),
            minBarLength: 0,
          },
        ],
      };
    },
    datasetSeats() {
      return {
        labels: this.statisticSeats.map((value) => {
          return value.name 
        }),
        datasets: [
          {
            label: "Seats",
            backgroundColor: "#f87979",
            minBarLength: 0,
            data: this.statisticSeats.map((value) => value.count),
          },
        ],
      };
    },
  },
  methods: {
    ...mapActions(["fetchStatisticAirlines", "fetchStatisticSeats"]),
    async setValue() {
      const airlines = this.airlines.map((value) => value.id);
      const seats = this.seats.map((value) => value.id);
      Promise.all([
        this.fetchStatisticAirlines(airlines),
        this.fetchStatisticSeats(seats),
      ]).then(() => {
        this.loadedAirline = true;
      });
    },
    getName(value, type){
      if(type==='airline'){
        return  value.name || this.airlines.find(airline=> airline.id===value.id).name
      } else{
        return value.name || this.seats.find(seat=> seat.id===value.id).name
      }
    },
    handleAirline() {
      this.loadedAirline = true;
      this.loadedSeat = false;
      this.index = 0;
    },
    handleSeat() {
      this.loadedAirline = false;
      this.loadedSeat = true;
      this.index = 0;
    },
    changeIndex(index) {
      this.index = index;
    },
    handleViewOrder(id) {
      window.scrollTo({
        to: 0,
        behavior: "smooth",
      });
      this.$router.push(`/order/search/${id}`);
    },
  },
};
</script>

<style scoped>
.statistic {
  padding-bottom: 30px;
  background: #f7f7f8;
  position: relative;
}
.title {
  font-size: 24px;
  font-weight: 600;
  text-align: center;
  padding: 20px 25px;
  opacity: 0.8;
}
.btn {
  border: 1px solid blue;
  color: blue;
  padding: 6px 12px;
  font-weight: 500;
  margin-right: 12px;
  margin-bottom: 20px;
  border-radius: 5px;
  transition: all 0.3s ease-in;
}
.btn:hover {
  cursor: pointer;
  background: blue;
  color: #fff;
}
.char {
  max-width: 400px;
  padding-right: 24px;
}
.nav-title {
  background: #00aeef;
  padding: 6px 0;
  text-align: center;
  color: #fff;
  font-size: 18px;
  font-weight: 500;
  border-radius: 5px;
}
.nav-item {
  border: 1px solid #ccc;
  border-bottom: none;
  padding: 8px 6px;
  overflow-y: auto;
  font-size: 16px;
  background: #fff;
}
.nav-item:last-child {
  border-bottom: 1px solid #ccc;
}
.nav-item p {
  transition: all 0.3s ease-in;
}
.nav-item p:hover {
  cursor: pointer;
  color: #00aeef;
}
.text {
  text-align: center;
  padding-top: 8px;
  font-size: 14px;
  transition: all 0.3s ease-in;
}
.text:hover {
  cursor: pointer;
  color: #00aeef;
}
</style>