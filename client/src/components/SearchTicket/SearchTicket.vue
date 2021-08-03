<template>
  <div class="search">
    <div class="container">
      <div class="row">
        <div class="col-12 col-md-8">
          <div class="row table-row mb-2">
            <div
              v-for="(day, index) in date"
              :class="{
                col: true,
                'table-header': true,
                active: index === 3,
                cursor: true,
              }"
              :key="day.index"
              @click="() => search(day)"
            >
              {{ getNameDate(day.index) }} ({{ day.day }})
            </div>
          </div>
          <div class="row table-row">
            <div class="col-3 table-header">Hãng hàng không</div>
            <div class="col-2 table-header">Giờ bay</div>
            <div class="col-3 table-header">Địa điểm</div>
            <div class="col-4 table-header">Chọn mua</div>
          </div>
          <div
            class="table-row"
            v-for="flight in filterflights"
            :key="flight.id"
          >
            <div class="row table">
              <div class="col-3 table-col nth-1">{{ flight.flight.airline }}</div>
              <div class="col-2 table-col nth-2">
                {{ flight.flight._start }} - {{ flight.flight._end }}
              </div>
              <div class="col-3 table-col nth-3">
                {{ flight.flight._from }} - {{ flight.flight._to }}
              </div>
              <div class="col-4 table-col nth-4">
                <div class="btn--show" @click="() => handleShowInfo(flight.flight.id)">
                  Chi tiết
                </div>
                <div class="btn btn--buy" @click="() => handleBuy(flight)">
                  Mua
                </div>
              </div>
            </div>
            <div class="row">
              <information-ticket
                :ticket="flight"
                v-if="showInfo.isShow && showInfo.id === flight.flight.id"
                class="info-ticket"
                :formatPrice="formatPrice"
                :value="value"
                @input="
                  (newValue) => {
                    value = newValue;
                  }
                "
              />
            </div>
          </div>
        </div>
        <div class="col-12 col-md-4">
          <div class="d-none d-md-block">
            <!-- Tìm kiếm chuyến bay -->
            <SearchForm />
            <!-- Lọc giá trị -->
            <FilterForm />
            <!-- Sắp xếp -->
            <div class="form">
              <div class="form-title">Sắp xếp</div>
              <!-- <div class="form-control">
                <label for="" class="form-label">Sắp xếp theo giá</label>
                <select class="form-input" v-model="sort.price">
                  <option value="ASC">Tăng dần</option>
                  <option value="DSC">Giảm dần</option>
                </select>
              </div> -->
              <div class="form-control">
                <label for="" class="form-label">Giờ cất cánh</label>
                <select class="form-input" v-model="sort._time">
                  <option value="ASC">Tăng dần</option>
                  <option value="DSC">Giảm dần</option>
                </select>
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
import { mapActions, mapGetters, mapMutations } from "vuex";
import SearchForm from "./SearchForm";
import FilterForm from "./FilterForm";
import InformationTicket from "./InformationTicket.vue";
import helper from "../Helper/Helper";
import Loading from '../Loading.vue';
export default {
  name: "SearchTicket",
  components: { SearchForm, FilterForm, InformationTicket, Loading },
  async created() {
    await this.setTicket();
  },
  data() {
    return {
      sort: {
        _time: "ASC",
      },
      showInfo: {
        isShow: false,
        id: null,
      },
      value: {
        quantity: 1,
        price: 0,
        seat: "",
        flight_seat:'',
        count: '',
      },
      day: null,
    };
  },
  computed: {
    ...mapGetters(["filterflights", "query"]),
    date() {
      let dateArray;
      if (!this.query.day) {
        let today = new Date(Date.now());
        const day = today.getDay();
        dateArray = this.fillDate(day);
      } else {
        const day = helper.getDayTime(this.query.day);
        dateArray = this.fillDate(day.getDay());
      }
      return dateArray;
    },
  },
  methods: {
    ...mapActions(["searchflights"]),
    ...mapMutations(["SORT_TICKET", "SET_BOOKING_TICKET", "SET_QUERY"]),
    async setTicket() {
      if (!this.query.day) {
        const today = new Date(Date.now());
        const day = helper.getDayString(today);
        const weekday = today.getDay();
        this.SET_QUERY({
          day,
          weekday,
        });
      }
      if (this.filterflights.length === 0) {
        await this.searchflights(this.query);
      }
    },
    formatTime(time) {
      return time.split(" ")[1];
    },
    formatPrice(price) {
      return helper.formatMoney(price, 1);
    },
    handleShowInfo(id) {
      if (id === this.showInfo.id) {
        this.showInfo.isShow = !this.showInfo.isShow;
      } else {
        this.showInfo.id = id;
        this.showInfo.isShow = true;
        this.value = {
          quantity: 1,
          price: 0,
          seat: "",
        };
      }
    },
    handleBuy(ticket) {
      const data= {
        ...ticket.flight,
        ...this.value,
        date_flight: this.query.day,
      }
      console.log(data, 'orders....')
      this.SET_BOOKING_TICKET(data);
      this.$router.push("/booking");
    },
    getNameDate(time) {
      return helper.getDate(time);
    },
    async search(time) {
      this.SET_QUERY({
        day: time.day,
        weekday: time.index,
      });
      await this.searchflights(this.query);
    },
    fillDate(index) {
      let t = index,
        day = helper.getDayTime(this.query.day);
      let res = new Array(7).fill(null);
      res[3] = {
        index,
        day: helper.getDayString(day),
      };
      for (let i = 4; i < 7; i++) {
        t++;
        day.setDate(day.getDate() + 1);
        if (t >= 7) t = 0;
        res[i] = {
          index: t,
          day: helper.getDayString(day),
        };
      }
      t = index;
      day = helper.getDayTime(this.query.day);
      for (let i = 2; i >= 0; i--) {
        t--;
        day.setDate(day.getDate() - 1);
        if (t < 0) t = 6;
        res[i] = {
          index: t,
          day: helper.getDayString(day),
        };
      }
      return res;
    },
  },
  watch: {
    "sort._time": function (newValue) {
      if (newValue) {
        this.SORT_TICKET({ _time: newValue });
        this.sort.price = "";
        window.scrollTo({
          top: 100,
          behavior: "smooth",
        });
      }
    },
    "sort.price": function (newValue) {
      if (newValue) {
        this.SORT_TICKET({ price: newValue });
        this.sort._time = "";
        window.scrollTo({
          top: 100,
          behavior: "smooth",
        });
      }
    },
  },
};
</script>

<style scoped>
.search {
  padding: 35px 0;
  position: relative;
}
.table-header,
.table-col {
  border: 1px solid #ccc;
  border-right: none;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.table-header:nth-child(4) {
  border-right: 1px solid #ccc;
}
.table-header {
  background: rgb(36, 157, 238);
  padding: 8px 6px;
  color: #fff;
  font-weight: 500;
}
.table-col {
  border-bottom: none;
  padding: 4px 0;
  border-top: none;
}
.table-col:nth-child(4) {
  border-right: 1px solid #ccc;
}
.table {
  border-bottom: 1px solid #ccc;
}
.nth-4 {
  display: flex;
  justify-content: space-between;
  padding: 4px 6px;
}
.btn--show {
  text-decoration: underline;
  color: blue;
  opacity: 0.7;
  transition: opacity 0.4s linear;
}
.btn--show:hover {
  cursor: pointer;
  opacity: 1;
}
.btn {
  padding: 3px 12px;
  border-radius: 5px;
  border: 1px solid blue;
  color: blue;
  transition: all 0.3s linear;
}
.btn:hover {
  background: blue;
  opacity: 0.8;
  color: #fff;
  cursor: pointer;
}
.info-ticket {
  border: 1px solid #ccc;
  border-top: none;
  /* padding: 12px 13px; */
  padding-top: 12px;
  padding-bottom: 12px;
}
.form {
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.form-title {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  background: #249dee;
  text-align: center;
  border-radius: 3px;
  padding: 12px;
  margin-bottom: 12px;
}
.form-control {
  padding-bottom: 12px;
  padding-right: 12px;
  padding-left: 12px;
  display: flex;
  align-items: center;
  width: 100%;
  font-weight: 500;
}
.form-label {
  padding-right: 4px;
}
.form-date {
  flex-grow: 1;
}
.form-input {
  flex-grow: 1;
  outline: none;
  border: 1px solid #ccc;
  padding: 6px 8px;
  border-radius: 5px;
}
.form-input:hover {
  border-color: blue;
}
.error {
  padding-bottom: 12px;
  padding-right: 12px;
  padding-left: 12px;
  color: red;
}
.form-submit {
  border: 1px solid blue;
  color: blue;
  background: #fff;
  font-weight: 600;
  padding: 8px 12px;
  border-radius: 5px;
  transition: all 0.3s ease-in-out;
  outline: none;
}
.form-submit:hover {
  background: blue;
  opacity: 0.7;
  color: #fff;
  cursor: pointer;
}
.cursor:hover {
  cursor: pointer;
}
.active {
  background: #4b4b4b;
  color: #fff;
}
</style>