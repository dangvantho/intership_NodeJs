<template>
  <form class="form" ref="form" @submit="handleSubmit">
    <div class="form-title">Bộ lọc</div>
    <div class="form-control">
      <label for="" class="form-label"> Khung giờ </label>
      <select class="form-input" v-model="time">
        <option value="0-6">0-6h</option>
        <option value="6-12">6-12h</option>
        <option value="12-18">12-18h</option>
        <option value="18-24">18h-24h</option>
      </select>
    </div>
    <div class="form-checkbox">
      <label for="" class="form-label"> Hãng hàng không </label>
      <div class="mt-2"></div>
      <div class="form-control" v-for="airline in airlines" :key="airline.id">
        <input
          class="mx-2"
          type="checkbox"
          checked="true"
          ref="checkbox"
          :value="airline.name"
        />
        <label for="" class="form-label">
          {{ airline.name }}
        </label>
      </div>
    </div>
    <div class="form-control d-flex justify-content-center">
      <input type="submit" value="Lọc kết quả" class="form-submit" />
    </div>
  </form>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
export default {
  name: "FilterTicket",
  components: {},
  props: [],
  data() {
    return {
      time: null,
    };
  },
  computed: {
    ...mapGetters(["airlines"]),
  },
  methods: {
    ...mapMutations(["FILTER_FLIGHT"]),
    handleSubmit(e) {
      e.preventDefault();
      let airlines = [];
      for (let value of this.$refs.checkbox) {
        if (value.checked) {
          airlines.push(value.value);
        }
      }
      this.FILTER_FLIGHT({ time: this.time, airlines });
      window.scrollTo({
        top: 100,
        behavior: "smooth",
      });
    },
  },
  watch: {
    "form._time": function () {
      console.log(this.form);
    },
  },
};
</script>

<style scoped >
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
.form-checkbox {
  padding: 12px;
  padding-top: 0;
  font-weight: 500;
}
</style>