<template>
  <div class="order">
    <div class="container">
      <div class="row">
        <div class="col-12 col-md-8" style="background: #fff; height: 320px">
          <div class="form pb-2">
            <div class="row">
              <div class="title mb-3">Thông tin vé</div>
              <div class="col-6 text">
                Mã đơn hàng:
                <span>{{ order.id }}</span>
              </div>
              <div class="col-6 text">
                Người mua:
                <span>{{ order.user_name }}</span>
              </div>
              <div class="col-6 text">
                Thời gian đặt vé:
                <span>{{ order.create_at }}</span>
              </div>
              <div class="col-6 text">
                Email:
                <span>{{ order.email }}</span>
              </div>
              <div class="col-6 text">
                Ngày xuất phát:
                <span>{{ order._time }}</span>
              </div>
              <div class="col-6 text">
                Hãng hàng không:
                <span>{{ order.airline }}</span>
              </div>
              <div class="col-6 text">
                Loại ghế:
                <span>{{ order.seat }}</span>
              </div>
              <div class="col-6 text">
                Địa điểm:
                <span> {{ order._from }} - {{ order._to }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-4" v-show="user.name">
          <div class="row">
            <div class="pe-0 ps-0 ps-md-3">
              <div class="form border">
                <div class="title">Danh sách vé</div>
                <div
                  class="item"
                  v-for="order in orders"
                  :key="order.id"
                  :data-id="order.id"
                  @click="handleClick"
                >
                  Mã vé: {{ order.id }}
                </div>
                <button class='item load-more' @click="loadmore" :disabled="disabled">Tải thêm</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  components: { },
  name: "Order",
  created() {
    this.getValue();
  },
  data() {
    return {
      page: 1,
      limit: 6,
      disabled: false,
    };
  },
  computed: {
    ...mapGetters(["order", "user", "allOrders"]),
    orders() {
      return this.allOrders;
    },
  },
  methods: {
    ...mapActions(["fetchOrder", "fetchAllOrders", "fetchOrders"]),
    async getValue() {
      const id = this.$router.currentRoute.params.id;
      await this.fetchOrder(id);
      if (this.allOrders.length === 0) {
        await this.fetchAllOrders({
          _limit: this.limit,
          page: this.page
        });
        this.page++
      }
    },
    async handleClick(e) {
      const id = e.target.dataset.id;
      await this.fetchOrder(id);
      this.$router.push(`/order/search/${id}`);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
    async loadmore(){
      const res= await this.fetchAllOrders({
          _limit: this.limit,
          page: this.page
        });
      if(res.err){
        this.page++
        return
      } else{
        this.disabled= true
      }
    }
  },
};
</script>

<style scoped>
.order {
  background: #f7f7f8;
  padding: 20px 12px;
  padding-left: 30px;
  min-height: 700px;
}
.form {
  margin-bottom: 16px;
  /* border: 1px solid #ccc; */
  border-top: none;
  
}
.border {
  border: 1px solid #ccc;
}
.title {
  text-align: center;
  background: #249dee;
  padding: 8px 0;
  font-size: 18px;
  font-weight: 500;
  color: #fff;
}
.text {
  padding-bottom: 12px;
  font-size: 14px;
  font-weight: 400;
}
.item {
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  padding: 12px 0;
  border-top: 1px solid #ccc;
  transition: all 0.3s linear;
  background: #fff;
}
.item:hover {
  cursor: pointer;
  color: #249dee;
}
.load-more{
  border: none;
  border-top: 1px solid #ccc;
  outline: none;
  background: #fff;
  text-align: center;
  height: 100%;
  width: 100%;
}
.item[disabled='disabled']{
  cursor: not-allowed;
}
</style>
