<template>
  <div class="booking">
    <div class="container">
      <div class="row">
        <div class="col-12 col-md-0">
          <div class="d-block d-md-none pb-4">
            <Price :ticket="bookingTicket" />
          </div>
        </div>
        <div class="col-12 col-md-8">
          <div class="row">
            <div class="col-12">
              <div class="form">
                <div class="form-title">Thông tin vé máy bay</div>
                <InforTicket :ticket="bookingTicket" />
              </div>
            </div>
            <div class="col-12">
              <div class="form">
                <div class="form-title">Thông tin liên lạc</div>
                <BookingContact />
              </div>
            </div>
            <div class="col-12">
              <div class="form">
                <div class="form-title">Thông tin hành khách</div>
                <Customers :quantity="bookingTicket.quantity || 1" />
              </div>
            </div>
          </div>
          <div class="col-12">
            <div class="d-flex justify-content-end">
              <div class="form-submit" @click="handleSubmit">Mua vé</div>
            </div>
          </div>
        </div>
        <div class="col-0 col-md-4">
          <div class="d-none d-md-block">
            <Price :ticket="bookingTicket" />
          </div>
        </div>
      </div>
    </div>
    <loading/>
    <Error :content="err" v-if="err" />
    <Success :content="message" v-if="message" />
  </div>
</template>

<script>
import Price from "./Price";
import InforTicket from "./InforTicket";
import BookingContact from "./BookingContact";
import Customers from "./Customers";
import Error from "../Message/Error";
import Success from "../Message/Success";
import helper from "../Helper/Helper";
import { mapActions, mapGetters } from "vuex";
import Loading from '../Loading.vue';
export default {
  name: "Booking",
  components: { Price, InforTicket, BookingContact, Customers, Error, Success, Loading, },
  created() {
    this.checkBooking();
  },
  data() {
    return {
      err: null,
      message: null,
    };
  },
  computed: {
    ...mapGetters([
      "bookingTicket",
      "bookingCustomers",
      "bookingContact",
      "user",
    ]),
  },
  methods: {
    ...mapActions(["bookTicket"]),
    formatPrice(price) {
      helper.formatMoney(price,1)
    },
    async handleSubmit() {
      // Check contact
      let res = helper.validate(this.bookingContact);
      if (!res.status) {
        this.err = "Thiếu thông tin liên hệ";
        return;
      }
      // Check customer
      let customers = this.bookingCustomers;
      for (let i = 0; i < this.bookingTicket.quantity; i++) {
        if (!customers[i]) {
          this.err = "Thiếu thông tin người dùng thứ " + (i + 1);
          return;
        } else {
          res = helper.validate(customers[i]);
          if (!res.status) {
            this.err = `Thiếu thông tin người dùng thứ ${i + 1}`;
            return;
          }
        }
      }
      // Buy ticket
      const ticket = {
        id: this.bookingTicket.flight_seat,
        quantity: this.bookingTicket.quantity,
        date_flight: this.bookingTicket.date_flight,
        flight_seat: this.bookingTicket.flight_seat,
        date_start: this.bookingTicket.date_start,
        date_end: this.bookingTicket.date_end,
        isdelete: this.bookingTicket.isdelete,
      };
      console.log(this.bookingTicket, ticket)
      let form = {
        contact: this.bookingContact,
        ticket,
        customers: this.bookingCustomers,
      };
      const id = this.user.id || localStorage.getItem("clientId");
      if (id) {
        form.user = { id };
      }
      res = await this.bookTicket(form);
      if (res.err) {
        this.err = res.err;
      } else {
        this.message = res.message;
      }
    },
    checkBooking() {
      if (!this.bookingTicket.id) {
        console.log(11111);
        this.$router.replace("/booking/404");
      }
    },
  },
  watch: {
    err() {
      setTimeout(() => {
        this.err = null;
      }, 3000);
    },
    message() {
      setTimeout(() => {
        this.message = null;
        this.$router.replace("/search-ticket");
      }, 3000);
    },
  },
};
</script>

<style scoped>
.booking {
  padding: 20px 0;
  position: relative;
}
.form {
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding-bottom: 20px;
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
</style>