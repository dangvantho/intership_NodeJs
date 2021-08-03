<template>
  <form class="form" @submit="handleSubmit">
    <div class="form-title">Tìm kiếm vé máy bay</div>
    <div class="form-control">
      <label for="" class="form-label"> Điểm đi </label>
      <select class="form-input" v-model="query._from">
        <option
          v-for="location in locations"
          :key="location.id"
          :value="location.id"
        >
          {{ location.name }}
        </option>
      </select>
    </div>
    <div class="form-control">
      <label for="" class="form-label"> Điểm đến </label>
      <select class="form-input" v-model="query._to">
        <option
          v-for="location in locations"
          :key="location.id"
          :value="location.id"
        >
          {{ location.name }}
        </option>
      </select>
    </div>
    <div class="error">
      {{ errs._to }}
    </div>
    <div class="form-control">
      <label for="" class="form-label"> Ngày đi </label>
      <DatePicker
        v-model="query.day"
        :format="'DD/MM/YYYY'"
        valueType="DD/MM/YYYY"
        class="form-date"
      />
    </div>
    <div class="error">
      {{ errs.weekday }}
    </div>
    <div class="form-control d-flex justify-content-center">
      <input type="submit" value="Tìm kiếm" class="form-submit" />
      <div class="reset ms-2" @click="handleResetForm">Reset</div>
    </div>
  </form>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import DatePicker from "vue2-datepicker";
export default {
  name: "SearchForm",
  components: { DatePicker },
  props: [],
  data() {
    return {
      errs: {
        _to: null,
        weekday: null,
      },
    };
  },
  computed: {
    ...mapGetters(["locations", "airlines", 'query']),
  },
  methods: {
    ...mapMutations(['SET_QUERY','RESET_QUERY']),
    ...mapActions(["searchflights"]),
    async handleSubmit(e) {
      e.preventDefault();
      if (this.errs._to || this.errs._time) {
        return;
      }
      await this.searchflights(this.query);
    },
    handleResetForm() {
      this.RESET_QUERY()
    },
  },
  watch: {
    "query.day": function (newValue) {
      const time = this.query.day.split("/");
      const year = time[2] - 0,
        month = time[1] - 1,
        date = time[0];
        let day= new Date(year, month, date)
        day.setDate(day.getDate()+ 1)
      if (day < new Date(Date.now())) {
        this.errs.weekday = "Bạn hãy chọn ngày lớn hơn hiện tại";
      } else {
        day.setDate(day.getDate()-1)
        this.SET_QUERY({weekday: day.getDay(), day: newValue})
        this.errs.weekday = null;
      }
    },
    "query._to": function (newValue) {
      if (this.query._from === this.query._to && this.query._from) {
        this.errs._to = "Địa điểm đến phải khác địa điểm đi";
      } else {
        this.SET_QUERY({ _to: newValue})
        this.errs._to = null;
      }
    },
    'query._from': function(newValue){
      this.SET_QUERY({ _from: newValue})
    }
  },
};
</script>

<style scoped>
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
  line-height: 16px;
}
.form-submit:hover {
  background: blue;
  opacity: 0.7;
  color: #fff;
  cursor: pointer;
}
.reset {
  border: 1px solid rgb(240, 139, 8);
  color: rgb(240, 139, 8);
  background: #fff;
  font-weight: 600;
  padding: 8px 12px;
  border-radius: 5px;
  transition: all 0.3s ease-in-out;
  outline: none;
  line-height: 16px;
}
.reset:hover {
  background: rgb(240, 139, 8);
  opacity: 0.7;
  color: #fff;
  cursor: pointer;
}
</style>