<template>
  <div>
    <p class='error'>
      {{errs.seat_id || errs.quantity || errs.price}}
    </p>
    <div class="d-flex justify-content-between">
      <select v-model="values.seat_id" class="select">
        <option v-for="seat in seats" :key="seat.id" :value="seat.id">
          {{ seat.name }}
        </option>
      </select>
      <div class="input">
        <input
          type="number"
          v-model="values.quantity"
          step="10"
          class="seat-number"
        />
        <input type="text" class="seat-price" v-model="values.price" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import helper from "../Helper/Helper";
export default {
  name: "TypeSeat",
  data() {
    return {
      values: {
        seat_id: null,
        price: null,
        quantity: 30,
      },
      timeout: null,
      errs: {
        price: null,
        quantity: null,
        seat_id: null,
      },
    };
  },
  computed: {
    ...mapGetters(["seats"]),
  },
  methods: {
    changeInput(value, type) {
      if (this.timeout) clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        if (!value) {
          this.errs[type] = "Không được để trống";
        }
        this.errs[type] = null;
        this.$emit("changeData", this.values);
      }, 800);
    },
  },
  watch: {
    "values.seat_id": function (newValue) {
      this.changeInput(newValue, "seat_id");
    },
    "values.quantity": function (newValue) {
      this.changeInput(newValue, "quantity");
    },
    "values.price": function () {
      this.values.price = helper.formatMoney(this.values.price, 1);
      this.changeInput(this.values.price, "price");
    },
  },
};
</script>

<style scoped>
.select {
  flex-grow: 1;
  margin-right: 4px;
  max-width: 120px;
}
.seat-number {
  width: 40px;
  margin-right: 4px;
  border: 1px solid #ccc;
  padding: 6px 0;
  outline: none;
}
.seat-number.text {
  border: none;
  text-align: center;
}
.seat-price {
  width: 90px;
  margin-left: 12px;
  padding: 6px 0;
  border: 1px solid #ccc;
  outline: none;
  text-align: center;
}
.seat-price.text {
  border: none;
}
.seat_label-count {
  padding-right: 70px;
}
.error{
  color: red;
  padding-bottom: 8px;
}
</style>