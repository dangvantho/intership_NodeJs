<template>
  <div class="form">
    <div class="form-label d-flex">
      {{ isDelete ? "Cho chuyến bay tiếp tục?" : "Tạm dừng chuyến bay?" }}
      <div class="btn-text" @click="handleStatusFlight">Ok</div>
    </div>
    <div class="form-control">
      <div class="form-label">Thay đổi giá tiền và số lượng mỗi loại vé:</div>
      <div class="form-label d-flex justify-content-between">
        <p>Loại ghế</p>
        <p>
          <span class="seat_label-count">Số lượng</span>
          <span>Giá</span>
        </p>
      </div>
      <p class='error'>
        {{err}}
      </p>
      <div
        class="form-control d-flex justify-content-between"
        v-for="item in flight_seat"
        :key="item.id"
      >
        <div class="seat-title">
          {{ getNameSeat(item.seat_id) }}
        </div>
        <div class="d-flex mb-3">
          <input
            type="number"
            v-model="item.quantity"
            step="10"
            class="seat-number"
          />
          <input type="text" class="seat-price" v-model="item.price" />
        </div>
      </div>
    </div>
    <div class="d-flex justify-content-center mt-2">
      <div class="submit" @click="handleSubmit">Cập nhật thông tin</div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import helper from "../Helper/Helper";
export default {
  name: "ChangeFlight",
  created() {
    this.setState();
  },
  props: ["ticket"],
  data() {
    return {
      isDelete: false,
      flight_seat: [],
      timeout: null,
      err: null,
    };
  },
  computed: {
    ...mapGetters(["seats", "allTickets"]),
    findTicket() {
      const ticket = this.allTickets.find(
        (value) => value.flight.id == this.ticket
      );
      if (ticket) {
        return ticket;
      } else
        return {
          flight: {},
          flight_seat: [],
        };
    },
  },
  methods: {
    ...mapActions(["changeTicket"]),
    setState() {
      console.log(this.findTicket.flight);
      this.isDelete = this.findTicket.flight.isdelete;
      this.flight_seat = [...this.findTicket.flight_seat];
    },
    handleStatusFlight() {
      this.isDelete = !this.isDelete;
    },
    getNameSeat(id) {
      const seat = this.seats.find((value) => value.id === id);
      if (seat) return seat.name;
      return "";
    },
    formatMoney(value, type) {
      return helper.formatMoney(value, type);
    },
    async handleSubmit() {
      this.handleCheckFlightSeat()
      if(this.err){
        return
      }
      const flight = {
        id: this.ticket - 0,
        isdelete: this.isDelete,
      };
      const res= await this.changeTicket({
        flight,
        flight_seat: this.flight_seat,
      });
      if(res.err){
          console.log(res)
      }else{
          this.$emit('viewFlight', this.ticket)
      }
    },
    handleCheckFlightSeat(){
      for(let value of this.flight_seat){
        for(let key in value){
          if(!value[key]){
            this.err="Thông tin loại ghế bị thiếu"
            return
          }else{
            this.err= null
          }
        }
      }
    }
  },
  watch: {
    ticket() {
      this.setState();
    },
  },
};
</script>

<style scoped>
.error{
  color: red;
  padding: 8px 0;
}
.btn-text {
  padding-left: 12px;
  color: blue;
  text-decoration: underline;
  cursor: pointer;
}
.form {
  font-size: 16px;
  font-weight: 500;
}
.form-label {
  width: 100%;
  display: block;
  font-size: 16px;
  padding-bottom: 6px;
}
.form-label span {
  color: red;
  padding-right: 32px;
}
.form-control {
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
.submit {
  border: 1px solid orange;
  color: orange;
  background: #fff;
  outline: none;
  padding: 8px 12px;
  border-radius: 5px;
  transition: all 0.4s linear;
}
.submit:hover {
  cursor: pointer;
  background: orange;
  opacity: 0.8;
  color: #fff;
}
</style>