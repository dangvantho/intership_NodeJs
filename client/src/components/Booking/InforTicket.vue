<template>
  <div class="ticket">
    <div class="container">
      <div class="row">
        <div class="col-6 text">
          Số lượng người <span>{{ ticket.quantity }}</span>
        </div>
        <div class="col-6 text">
          Ngày xuất phát:
          <span>{{ ticket.date_flight }}</span>
        </div>
      </div>
      <div class="row">
        <div class="col-6 text">
          Hãng hàng không:
          <span>{{ ticket.airline }}</span>
        </div>
        <div class="col-6 text">
          Loại ghế:
          <span>{{ ticket.seat }}</span>
        </div>
      </div>
      <div class="row">
        <div class="col-6 text">
          Địa điểm:
          <span> {{ ticket._from }} - {{ ticket._to }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import helper from '../Helper/Helper'
export default {
  name: "InforTicket",
  props: ["ticket"],
  methods: {
    formatPrice(price) {
      return helper.formatMoney(price,1)
    },
  },
};
</script>

<style >
.text-center {
  text-align: center;
}
.text {
  font-weight: 500;
}
.text span {
  color: red;
  opacity: 0.8;
}
</style>