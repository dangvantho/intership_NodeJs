<template>
  <div class="d-block">
    <div class="info">
      <div class="info-text">
        Từ <span>{{ ticket._from }}</span>
      </div>
      <div class="info-text">
        đến <span>{{ ticket._to }}</span>
      </div>
      <div class="info-text">
        Hãng hàng không <span class="text-red">{{ ticket.airline }}</span>
      </div>
      <div class="info-text">
        Loại ghế <span class="text-red">{{ ticket.seat }}</span>
      </div>
      <div class="info-text">
        Thời gian bay <span class="text-red">{{ ticket.date_flight }}</span>
      </div>
    </div>
    <div class="price">
      <div class="row justify-content-center">
        <div class="col-4 text-center">Số lượng vé</div>
        <div class="col-4 text-center">Giá mỗi vé</div>
        <div class="col-4 text-center">Tổng tiền</div>
      </div>
      <div class="row justify-content-center">
        <div class="col-4 text-center">
          <span>{{ticket.quantity}}</span>
        </div>
        <div class="col-4 text-center">{{ formatPrice(ticket.price) }} vnđ</div>
        <div class="col-4 text-center text-red">
          {{ formatPrice(ticket.price * ticket.quantity) }} vnđ
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "InformationTicket",
  props: ["ticket", "formatPrice",],
  data() {
    return {};
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
}
.form-submit:hover {
  background: blue;
  opacity: 0.7;
  color: #fff;
  cursor: pointer;
}
.info {
  display: flex;
  flex-wrap: wrap;
  border-bottom: 1px dashed #ccc;
}
.info-text {
  padding-right: 12px;
  padding-bottom: 6px;
  font-size: 16px;
}
.info-text:nth-child(3) {
}
.info-text span {
  font-weight: 600;
}
.text-red {
  color: red;
}
.price {
  margin-top: 8px;
  font-size: 16px;
}
.text-center {
  text-align: center;
}
.input {
  border: 1px solid #ccc;
  width: 50px;
  padding: 4px 6px;
  margin-top: 6px;
  outline: none;
}
.input:hover {
  border-color: blue;
}
</style>