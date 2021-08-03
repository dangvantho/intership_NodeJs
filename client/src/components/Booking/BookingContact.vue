<template>
  <div class="container">
    <div class="row">
      <div class="col-6">
        <div class="form-label">
          Tên người mua: <span class="error">{{ errs.name }}</span>
        </div>
        <input type="text" class="form-input" v-model="form.name" />
      </div>
      <div class="col-6">
        <div class="form-label">
          Email: <span class="error">{{ errs.email }}</span>
        </div>
        <input type="text" class="form-input" v-model="form.email" />
      </div>
      <div class="col-6">
        <div class="form-label">
          Số điện thoại: <span class="error">{{ errs.phone }}</span>
        </div>
        <input type="text" class="form-input" v-model="form.phone" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import helper from "../Helper/Helper";
export default {
  name: "BookingContact",
  created() {
    this.setForm();
  },
  data() {
    return {
      form: {
        name: null,
        email: null,
        phone: null,
      },
      errs: {
        name: null,
        email: null,
        phone: null,
      },
      timeout: null,
    };
  },
  computed: {
    ...mapGetters(["bookingContact"]),
  },
  methods: {
    ...mapMutations(["SET_CONTACT"]),
    setForm() {
      console.log("Set form");
      if (this.bookingContact) {
        this.form = this.bookingContact;
      }
    },
    saveData(cb, newValue) {
      if (this.timeout) clearTimeout(this.timeout);
      this.timeout = setTimeout(() => cb(newValue), 600);
    },
  },
  watch: {
    "form.email": function (newValue) {
      this.saveData(() => {
        let res = helper.checkEmail(newValue);
        if (!res) {
          this.errs.email = "Email không hợp lệ";
        } else {
          this.errs.email = null;
          this.SET_CONTACT(this.form);
        }
      }, newValue);
    },
    "form.name": function (newValue) {
      this.saveData(() => {
        if (!newValue) {
          this.errs.name = "Bạn phải điền giá trị";
        } else {
          this.errs.name = null;
          this.SET_CONTACT(this.form);
        }
      }, newValue);
    },
    "form.phone": function (newValue) {
      this.saveData(() => {
        if (newValue === null || newValue === undefined) {
          return;
        }
        const res = helper.checkPhone(newValue);
        if (!res) {
          this.errs.phone = "Số điện thoại không hợp lệ";
        } else {
          this.errs.phone = null;
          this.SET_CONTACT(this.form);
        }
      }, newValue);
    },
  },
};
</script>

<style scoped>
.form-label {
  padding-top: 4px;
  padding-bottom: 8px;
  font-weight: 500;
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
  padding-bottom: 12px;
  padding-right: 12px;
  padding-left: 12px;
  color: red;
}
</style>