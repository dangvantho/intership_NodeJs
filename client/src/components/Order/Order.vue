<template>
  <div class="order">
    <div class="container">
      <div class="row">
        <div class="col-12 col-md-8">
          <div class="form pb-2">
            <div class="row">
              <div class="title mb-3">Thông tin vé</div>
              <div class="col-6 text">
                Xác nhận mua vé:
                <span>{{ order.verify ? 'Đã xác nhận ': 'Chưa xác nhận' }}</span>
              </div>
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
                <span>{{ order.date_flight }}</span>
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
            <div class='row'>
              <div class='col-12'>
                <div class='d-flex justify-content-center'>
                  <div class='btn' @click="openALert=!openALert" v-show="checkDay(order.date_flight)">
                    Hủy vé
                  </div>
                </div>
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
                  :class="{item: true,active : order.id===currentId}"
                  v-for="order in orders"
                  :key="order.id"
                  :data-id="order.id"
                  @click="handleClick"
                >
                  Mã vé: {{ order.id }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <loading/>
    <Alert 
    :message="'Bạn có chắc chắn muốn hủy vé không?'" 
    :title="'Hủy vé'"
    v-on:handleDelete="handleDelete"
    v-on:closeAlert="openALert= !openALert"
    v-show="openALert"
    />
    <Error :content="err" v-show="err"/>
    <Success :content="message" v-show="message"/>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Alert from './Alert.vue'
import Error from '../Message/Error.vue'
import Success from '../Message/Success.vue'
import Loading from '../Loading.vue';
export default {
  name: "Order",
  components:{Alert, Success, Error, Loading},
  created() {
    this.getValue();
  },
  data() {
    return {
      openALert: false,
      err: '',
      message:'',
      currentId: null,
    };
  },
  computed: {
    ...mapGetters(["order", "user", "allOrders", "user_orders"]),
    orders() {
      let result = [];
      if (this.user.id) {
        result = this.user_orders;
      }
      return result;
    },
  },
  methods: {
    ...mapActions(["fetchOrder", "fetchAllOrders", "fetchOrders",'deleteOrder']),
    async getValue() {
      const id = this.$router.currentRoute.params.id;
      console.log(id);
      let res= await this.fetchOrder(id);
      if(!res.err){
        this.currentId= id
      }
      if (this.user.id) {
        if (this.user_orders.length === 0) {
          await this.fetchOrders();
        }
      }
    },
    async handleClick(e) {
      const id = e.target.dataset.id;
      if(id===this.currentId) return
      this.currentId= id
      await this.fetchOrder(id);
      this.$router.replace(`/order/search/${id}`);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
    checkDay(time){
      if(!time) return false
      let [t1, t2, t3]= time.split('/')
      let date= new Date(t3, t2-1, t1)
      date.setDate(date.getDate()-2)
      if(date > new Date(Date.now())) return true
      return false
    },
    async handleDelete(){
      this.openALert= false
      const res=await this.deleteOrder(this.order.id)
      if(res.err){
        this.err= res.err
      }else{
        this.message= res.message
      }
      setTimeout(()=>{
          this.err=''
          this.message=''
          this.$router.push('/')
        }, 3000)
    }
  },
};
</script>

<style scoped>
.order {
  margin-top: 30px;
  position: relative;
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
}
.active{
  color: #249dee;
}
.item:hover {
  cursor: pointer;
}
.btn{
  border: 1px solid red;
  color: red;
  padding: 8px 24px;
  border-radius: 5px;
  font-weight: 600;
  opacity: 0.6;
  transition: 0.3s;
}
.btn:hover{
  cursor: pointer;
  color: #fff;
  background: red;
}
</style>
