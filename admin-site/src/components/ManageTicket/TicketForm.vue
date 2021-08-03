<template>
  <div class="form">
    <div class="error"></div>
    <div class="form-control">
      <!-- Trạng thái vé -->
      <label for="" class="form-label">
        Trạng thái vé:
        <span class="text" v-show="type === 'get'">{{ findTicket.flight.isdelete ? 'Tạm dừng': 'Đang bay' }}</span>
      </label>
      <!-- From -->
      <label for="" class="form-label">
        Bay từ:
        <span>{{ err._from }}</span>
        <span class="text" v-show="type === 'get'">{{ findTicket.flight._from }}</span>
      </label>
      <select
        v-model="form._from"
        class="form-input"
        v-show="type !== 'get'"
        :disabled="disabled"
      >
        <option
          v-for="location in locations"
          :key="location.id"
          :value="location.id"
        >
          {{ location.name }}
        </option>
      </select>
      <!-- To -->
      <label for="" class="form-label">
        Bay đến:
        <span>{{ err._to }}</span>
        <span class="text" v-show="type === 'get'">{{ findTicket.flight._to }}</span>
      </label>
      <select
        v-model="form._to"
        class="form-input"
        v-show="type !== 'get'"
        :disabled="disabled"
      >
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
      <!-- Hãng bay -->
      <label for="" class="form-label">
        Hãng bay:
        <span>{{ err.airline }}</span>
        <span class="text" v-show="type === 'get'">{{
          findTicket.flight.airline
        }}</span>
      </label>
      <select
        v-model="form.airline"
        class="form-input"
        v-show="type !== 'get'"
        :disabled="disabled"
      >
        <option
          v-for="airline in airlines"
          :key="airline.id"
          :value="airline.id"
        >
          {{ airline.name }}
        </option>
      </select>
      <!-- Date -->
      <label for="" class="form-label">
        Ngày bay:
        <span>{{ err.weekday }}</span>
        <span class="text" v-show="type === 'get'">{{
          getNameDate(findTicket.flight.weekday)
        }}</span>
      </label>
      <select
        v-model="form.weekday"
        class="form-input"
        v-show="type !== 'get'"
        :disabled="disabled"
      >
        <option v-for="weekday in date" :key="weekday" :value="weekday">
          {{ getNameDate(weekday) }}
        </option>
      </select>
    </div>
    <div class="form-control">
      <!-- Thời gian bay -->
      <label for="" class="form-label">
        Bắt đầu bay lúc:
        <span>{{ err._start }}</span>
        <span class="text" v-show="type === 'get'">{{
          findTicket.flight._start
        }}</span>
      </label>
      <date-picker
        type="time"
        v-model="form._start"
        :format="format"
        valueType="format"
        class="form-input date-picker"
        v-show="type !== 'get'"
        :disabled="disabled"
      />
      <!-- Thời gian bay -->
      <label for="" class="form-label">
        Bay đến lúc:
        <span>{{ err._end }}</span>
        <span class="text" v-show="type === 'get'">{{ findTicket.flight._end }}</span>
      </label>
      <date-picker
        type="time"
        v-model="form._end"
        :format="format"
        valueType="format"
        class="form-input date-picker"
        v-show="type !== 'get'"
        :disabled="disabled"
      />
      <!-- Thời gian áp dụng chuyến bay -->
      <label for="" class="form-label">
        Áp dụng chuyến bay từ ngày:
        <span>{{ err._end }}</span>
        <span class="text" v-show="type === 'get'">{{ findTicket.flight.date_start }}</span>
      </label>
      <date-picker
        v-model="form.date_start"
        :format="'MM/DD/YYYY'"
        valueType="MM/DD/YYYY"
        class="form-input date-picker"
        v-show="type !== 'get'"
      />
      <!-- Thời gian áp dụng chuyến bay -->
      <label for="" class="form-label">
        Áp dụng đến ngày: 
        <span>{{ err._end }}</span>
        <span class="text" v-show="type === 'get'">{{ findTicket.flight.date_end }}</span>
      </label>
      <date-picker
        v-model="form.date_end"
        :format="'MM/DD/YYYY'"
        valueType="MM/DD/YYYY"
        class="form-input date-picker"
        v-show="type !== 'get'"
      />
      <!-- Loại ghế -->
      <label for="" class="form-label mb-1">
        <div class="d-flex justify-content-between">
          <p>Loại ghế</p>
          <p>
            <span class="seat_label-count">Số lượng</span>
            <span>Giá</span>
          </p>
        </div>
        <span class='error'>
          {{errFlightSeat}}
        </span>
      </label>
      <TypeSeat 
        v-on:changeData="(value)=>hanleAddFlightSeat(value)" 
        class="flight-seat" 
        v-if="type!=='get'"
      />
      <div 
        v-for="value in numberOfFlightSeat" 
        :key="value"
        style="width: 100%;"
      >
        <TypeSeat 
          v-on:changeData="(value)=>hanleAddFlightSeat(value)" 
          class="flight-seat"
          v-if="type!=='get'"
        />
      </div>
      <div 
        class='btn-text' 
        @click="numberOfFlightSeat.push(numberOfFlightSeat.length+1)"
        v-show="type!=='get'"
      >
        Thêm loại ghế mới
      </div>
      <!-- Submit -->
      <div class="d-flex justify-content-center">
        <input
          type="submit"
          :value="type === 'put' ? 'Thay đổi' : 'Thêm vé'"
          class="submit"
          @click="handleSubmit"
          :disabled="disabled"
          v-show="type !== 'get'"
        />
      </div>
    </div>
    <!-- Hiển thị thông tin loại ghế và giá tiền -->
    <div 
      class='form-control d-flex justify-content-between' 
      v-show="type==='get'"
      v-for="item in findTicket.flight_seat"
      :key="item.id"
    >
      <div class='seat-title'>
        {{getSeatName(item.seat_id)}}
      </div>
      <div class='d-flex' >
        <div class='seat-number'>{{item.quantity}}</div>
        <div class='seat-price'>{{formatMoney(item.price,1)}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import helper from "../Helper/Helper";
import DatePicker from "vue2-datepicker";
import TypeSeat from './TypeSeat.vue'
import "vue2-datepicker/index.css";
import { mapActions, mapGetters } from "vuex";
export default {
  name: "TicketForm",
  components: { DatePicker, TypeSeat },
  props: ["type", "ticket"],
  data() {
    return {
      form: {
        _from: null,
        _to: null,
        airline: null,
        _start: null,
        _end: null,
        weekday: null,
        date_start: null,
        date_end: null,
      },
      flight_seat:[],
      numberOfFlightSeat:[],
      format: "HH:mm",
      err: {},
      disabled: false,
      timeout: null,
      errFlightSeat: null,
    };
  },
  computed: {
    ...mapGetters(["locations", "seats", "airlines", "allTickets"]),
    findTicket() {
      const ticket = this.allTickets.find((value) => value.flight.id == this.ticket);
      if (ticket) {
        return ticket;
      } else return {
        flight: {},
        flight_seat:[],
      };
    },
    date() {
      return [0, 1, 2, 3, 4, 5, 6];
    },
  },
  methods: {
    ...mapActions(["postTicket",  "fetchAirlines"]),
    getSeatName(id) {
      const seat=this.seats.find(value=>value.id===id)
      if(seat) return seat.name
      else return ''
    },
    resetForm() {
      for (let key in this.form) {
          this.form[key] = null;
      }
      for (let key in this.err) {
        this.form[key] = null;
      }
    },
    getNameDate(date) {
      return helper.getDate(date);
    },
    formatMoney(money, type) {
      return helper.formatMoney(money, type);
    },
    handleChangeInput(cb){
      if(this.timeout) clearTimeout(this.timeout)
      this.timeout= setTimeout(cb, 700)
    },
    hanleAddFlightSeat(value){
      let exit=false
      this.flight_seat =this.flight_seat.map(flight_seat=>{
        if(flight_seat.seat_id === value.seat_id){
          flight_seat= {...value}
          flight_seat.price= helper.formatMoney(flight_seat.price)
          flight_seat.quantity -= 0
          exit= true
        }
        return flight_seat
      })
      if(!exit){
        value.quantity -=0
        value.price -=0
        this.flight_seat.push(value)
      }
    },
    async handleSubmit() {
      this.handleCheckFlightSeat()
      if(this.errFlightSeat){
        return
      }
      let err = helper.validate(this.form);
      if (err.status) {
        let data;
        if (this.type === "post") {
          data = await this.postTicket({
            flight: this.form,
            flight_seat: this.flight_seat,
          });
          if(!data.err) {
            this.resetForm()
          }
        } 
      } else {
        this.err = { ...err.errs };
      }
      window.scrollTo({
        top:0,
        behavior: 'smooth'
      })
    },
    handleCheckFlightSeat(){
      console.log(this.flight_seat)
      for(let value of this.flight_seat){
        for(let key in value){
          console.log(value, key)
          if(value[key]){
            this.errFlightSeat= null
          }else{
            this.errFlightSeat="Thiếu thông tin loại ghế"
            return false
          }
        }
        return true
      }
    }
  },
  watch: {
    type() {
      this.resetForm();
    },
    ticket() {
    },
  },
};
</script>

<style scoped>
.form {
  max-width: 400px;
}
.form-control {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
.form-label {
  width: 100%;
  display: block;
  font-size: 16px;
  padding-bottom: 6px;
}
.text {
  padding-left: 8px;
  color: blue !important;
}
.form-input {
  width: 100%;
  margin-bottom: 12px;
  padding: 6px 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 1px 2px #ccc;
  outline: none;
}
.form-input:hover {
  border-color: blue;
}
.form-input option {
  display: block;
  padding: 12px 8px;
  border-bottom: 1px solid #ccc;
}
.date-picker {
  padding: 0;
  border: none;
  border-radius: none;
}
.form-label span {
  color: red;
  padding-right: 32px;
}
.submit {
  border: 1px solid blue;
  color: blue;
  background: #fff;
  outline: none;
  padding: 8px 12px;
  border-radius: 5px;
  transition: all 0.4s linear;
}
.submit:hover {
  cursor: pointer;
  background: blue;
  opacity: 0.8;
  color: #fff;
}
*:disabled {
  cursor: not-allowed;
}
.error {
  color: red;
  padding-bottom: 6px;
}
.btn-text{
  color: blue;
  text-decoration: underline;
  padding: 10px 0;
  width: 100%;
  text-align: center;
  font-size: 18px;
  opacity: 0.6;
  transition: 0.3s;
}
.btn-text:hover{
  opacity: 1;
  cursor: pointer;
}
.flight-seat{
  width: 100%;
  overflow-x: hidden;
  margin-bottom: 20px;
}
.seat-number {
  width: 40px;
  margin-right: 4px;
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
  outline: none;
  text-align: center;
}
.seat-price.text {
  border: none;
}
</style>