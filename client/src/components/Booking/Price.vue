<template>
  <div class="price">
    <div class="price-title">Chi tiết giá</div>
    <h3>Chuyến đi</h3>
    <div class="d-flex justify-content-center align-items-center pb-1">
      <p>{{ ticket._from }}</p>
      <img :src="arrow" alt="" />
      <p>{{ ticket._to }}</p>
    </div>
    <div class="d-flex justify-content-between px-4 pb-1">
      <h4 class="price-text">Giá vé:</h4>
      <div class="price-text">
        {{ ticket.quantity }} x {{ formatPrice(ticket.price) }} vnd
      </div>
    </div>
    <div class="d-flex justify-content-between px-4">
      <div class="price-total">Tổng tiền</div>
      <div class="price-total">
        {{ formatPrice(ticket.price * ticket.quantity) }} vnd
      </div>
    </div>
  </div>
</template>

<script>
import arrow from "../../assets/arrow.png";
import helper from '../Helper/Helper'
export default {
  name: "Price",
  props: ["ticket"],
  data() {
    return {
      arrow,
    };
  },
  methods: {
    formatPrice(price) {
      return helper.formatMoney(price,1)
    },
  },
};
</script>

<style scoped>
.price {
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding-bottom: 20px;
}
.price-title {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  background: #249dee;
  text-align: center;
  border-radius: 3px;
  padding: 12px;
  margin-bottom: 12px;
}
.price h3 {
  color: #249dee;
  padding-left: 20px;
}
.price p {
  font-weight: 500;
  font-size: 16px;
}
img {
  height: 100%;
  object-fit: contain;
  padding: 0 20px;
}
.price-text {
  font-weight: 500;
  font-size: 16px;
}
.price-total {
  color: red;
  font-weight: 500;
  font-size: 16px;
}
</style>