<template>
  <div class="container">
    <div class="row">
      <div class="col-4 col-sm-3">
        <div class="customers">
          <div
            :class="{ customer: true, active: index === i }"
            v-for="(customer, i) in customers"
            :key="i"
            @click="() => handleChangeCustomer(i - 0)"
          >
            Người {{ i + 1 }}
          </div>
        </div>
      </div>
      <div class="col-8 col-sm-9">
        <div class="row">
          <div class="col-6">
            <div class="form-label text">
              Tên hành khách {{ index + 1 }}:
              <span class="error">{{ errs.name }}</span>
            </div>
            <input type="text" class="form-input" v-model="form.name" />
          </div>
          <div class="col-6">
            <div class="form-label text">
              Tuổi: <span class="error">{{ errs.age }}</span>
            </div>
            <input type="text" class="form-input" v-model="form.age" />
          </div>
          <div class="col-6">
            <div class="form-label text">
              Giới tính: <span class="error">{{ errs.sex }}</span>
            </div>
            <select class="form-input" v-model="form.sex">
              <option v-for="value in sex" :key="value" :value="value">
                {{ value }}
              </option>
            </select>
          </div>
          <div class="col-6">
            <div class="form-label text">
              Quốc tịch: <span class="error">{{ errs.nation }}</span>
            </div>
            <input type="text" class="form-input" v-model="form.nation" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  name: "Customers",
  props: ["quantity"],
  created() {
    this.setForm(0);
  },
  data() {
    return {
      form: {
        name: null,
        age: null,
        sex: null,
        nation: null,
      },
      errs: {
        name: null,
        age: null,
        sex: null,
        nation: null,
      },
      customers: new Array(this.quantity - 0).fill(0),
      sex: ["Nam", "Nữ", "Giới tính khác"],
      timeout: null,
      index: 0,
    };
  },
  methods: {
    ...mapMutations(["SET_CUSTOMER"]),
    handleChangeCustomer(index) {
      const data = JSON.parse(localStorage.getItem("customers"));
      if (data && data[index]) {
        this.setForm(index);
      }
      this.index = index;
      this.SET_CUSTOMER({
        index,
        value: this.form,
      });
      this.setForm(index);
    },
    saveData(value, type) {
      if (this.timeout) clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.check(type);
        if (!value) return;
        this.SET_CUSTOMER({
          index: this.index,
          value: this.form,
        });
      }, 800);
    },
    setForm(index) {
      const data = JSON.parse(localStorage.getItem("customers"));
      if (data) {
        console.log(data[index]);
        this.form = data[index];
      }
    },
    resetForm() {
      this.form = {
        name: null,
        age: null,
        sex: null,
        nation: null,
      };
    },
    check(type) {
      switch (type) {
        case "name":
        case "nation":
          if (this.form[type]) {
            this.errs[type] = null;
            break;
          }
          this.errs[type] = `Không được để trống`;
          break;
        case "age":
          if (typeof (this.form.age - 0) === "number") {
            this.errs.age = null;
            break;
          }
          this.errs[type] = "Số tuổi phải là số";
          break;
        default:
          return 1;
      }
    },
  },
  watch: {
    "form.age": function (newValue) {
      this.saveData(newValue, "age");
    },
    "form.sex": function (newValue) {
      this.saveData(newValue);
    },
    "form.name": function (newValue) {
      this.saveData(newValue, "name");
    },
    "form.nation": function (newValue) {
      this.saveData(newValue, "nation");
    },
  },
};
</script>

<style scoped>
.customers {
  /* background: rgb(15, 212, 41); */
  margin-right: calc(var(--bs-gutter-x) / -2);
  margin-left: calc(var(--bs-gutter-x) / -1);
  margin-top: -12px;
  text-align: center;
  height: 100%;
  padding-top: 12px;
}
.customer {
  padding: 8px 0;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease-in-out;
}
.customer:hover {
  color: #249dee;
  cursor: pointer;
}
.active {
  color: #249dee;
}
.form-label {
  padding-top: 4px;
  padding-bottom: 8px;
}
.form-date {
  flex-grow: 1;
}
.form-input {
  width: 100%;
  outline: none;
  border: 1px solid #ccc;
  padding: 6px 8px;
  border-radius: 5px;
}
.form-input:hover {
  border-color: blue;
}
.error {
  padding-left: 4px;
  color: red;
}
</style>