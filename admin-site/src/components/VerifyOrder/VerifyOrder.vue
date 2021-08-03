<template>
  <div class='verify-order'>
    <div class="container ">
      <div class="row">
        <div class="col-12 bg-white">
          <div class="d-block d-md-none">Filter</div>
          <div class="row table-row">
            <div class="col-3 table-header">Hãng hàng không</div>
            <div class="col-2 table-header">Giờ bay</div>
            <div class="col-3 table-header">Người đặt vé</div>
            <div class="col-4 table-header">Xác nhận</div>
          </div>
          <div
            class="table-row "
            v-for="ticket in orderNotVerify"
            :key="ticket.id"
          >
            <div class="row table">
              <div class="col-3 table-col nth-1">{{ ticket.airline }}</div>
              <div class="col-2 table-col nth-2">
                {{ ticket._start }} - {{ ticket._end}}
              </div>
              <div class="col-3 table-col nth-3">
                {{ ticket.user_name }}
              </div>
              <div class="col-4 table-col nth-4">
                <div class="btn--show" @click="() => handleShowInfo(ticket.id)">
                  Chi tiết
                </div>
                <div class="btn btn--buy" @click="() => handleVerify(ticket)">
                  Xác nhận
                </div>
              </div>
            </div>
            <div class="row">
              <information-ticket
                :ticket="ticket"
                v-if="showInfo.isShow && showInfo.id === ticket.id"
                class="info-ticket"
                :formatPrice="formatPrice"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <loading/>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Loading from '../../../../client/src/components/Loading.vue'
import InformationTicket from './InfomationTicket'
export default {
  name:'VerifyOrder',
  components:{ InformationTicket, Loading },
  created(){
    this.fetchOrderNotVerify()
  },
  data(){
    return {
      showInfo:{
        isShow: false,
        id: null
      }
    }
  },
  computed:{
    ...mapGetters(['orderNotVerify'])
  },
  methods:{
    ...mapActions(['fetchOrderNotVerify','verify']),
    formatTime(time) {
      return time.split(" ")[1];
    },
    formatPrice(price) {
      return price
        .toString()
        .replace(/\D/g, "")
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    handleShowInfo(id) {
      if (id === this.showInfo.id) {
        this.showInfo.isShow = !this.showInfo.isShow;
      } else {
        this.showInfo.id = id;
        this.showInfo.isShow = true;
        this.quantity = 1;
      }
    },
    async handleVerify(ticket){
      const {email, id}= ticket
      const res= await this.verify({email, id})
      console.log(res)
    }
  },
}
</script>

<style scoped>
.verify-order{
    min-height: 650px;
    background: #f7f7f8;
    padding: 30px;
    padding-left: 45px;
    position: relative;
}
.search {
  padding: 35px 0;
}
.table-header,
.table-col {
  border: 1px solid #ccc;
  border-right: none;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.table-header:nth-child(4) {
  border-right: 1px solid #ccc;
}
.table-header {
  background: rgb(36, 157, 238);
  padding: 8px 6px;
  color: #fff;
  font-weight: 500;
}
.table-col {
  border-bottom: none;
  padding: 4px 0;
  border-top: none;
}
.table-col:nth-child(4) {
  border-right: 1px solid #ccc;
}
.table {
  border-bottom: 1px solid #ccc;
}
.nth-4 {
  display: flex;
  justify-content: space-between;
  padding: 4px 6px;
}
.btn--show {
  text-decoration: underline;
  color: blue;
  opacity: 0.7;
  transition: opacity 0.4s linear;
}
.btn--show:hover {
  cursor: pointer;
  opacity: 1;
}
.btn {
  padding: 3px 12px;
  border-radius: 5px;
  border: 1px solid blue;
  color: blue;
  transition: all 0.3s linear;
}
.btn:hover {
  background: blue;
  opacity: 0.8;
  color: #fff;
  cursor: pointer;
}
.info-ticket {
  border: 1px solid #ccc;
  border-top: none;
  /* padding: 12px 13px; */
  padding-top: 12px;
  padding-bottom: 12px;
}

</style>