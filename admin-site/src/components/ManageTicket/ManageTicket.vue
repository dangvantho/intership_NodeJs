<template>
  <div class="ticket">
    <h3>Quản lý vé máy bay</h3>
    <div class="container">
      <div class="row">
        <div class="col-12 col-md-6">
          <h4 class="list-title">
            Danh sách vé
            <div class="btn btn--add" @click="handlePost">Thêm mới</div>
          </h4>
          <div class="content-left">
            <div class="list" v-for="ticket in allTickets" :key="ticket.id">
              <div class="item">
                <p class="item-text">Bay từ: {{ ticket.flight._from }}</p>
                <p class="item-text">Bay đến: {{ ticket.flight._to }}</p>
                <p class="item-text" style="width: 100%;">
                  Hiệu lực từ ngày : {{ ticket.flight.date_start }} đến ngày {{ticket.flight.date_end}}
                </p>
                <p class="item-text" >
                  Ngày bay: {{ getNameDate(ticket.flight.weekday)}}
                </p>
                <p class="item-text" >
                  Giờ bay: {{ticket.flight._start}} - {{ticket.flight._end}}
                </p>
                <div class="item-control" :data-id="ticket.flight.id">
                  <div class="btn btn--show" @click="handleShow">
                    Xem chi tiết
                  </div>
                  <div class="btn btn--change" @click="handlePut">Thay đổi</div>
                  <div class="btn btn--delete" @click="handleDelete">Dừng chuyến bay</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-6" ref="form">
          <h4 class="choose" v-show="post">Thêm vé máy bay</h4>
          <h4 class="choose" v-show="put">Thay đổi thông tin</h4>
          <h4 class="choose" :class="'d-none d-md-block'" v-show="showTicket">
            Thông tin vé
          </h4>
          <ticket-form :type="'post'" v-if="post" />
          <ChangeFlight 
            :ticket="ticketId-0" 
            v-if="put" 
            v-on:viewFlight="(value)=>handleShowFlight(value)" 
          />
          <ticket-form
            :type="'get'"
            :ticket="ticketId"
            v-if="showTicket"
            class="d-none d-md-block"
          />
        </div>
      </div>
    </div>
    <div v-if="showTicket">
      <div class="d-block d-md-none">
        <div class="modal">
          <div class="modal-body">
            <div class="btn-close" @click="handleClose"></div>
            <div class="modal-title">Thông tin vé máy bay</div>
            <ticket-form :type="'get'" :ticket="ticketId" />
          </div>
          <div class="close" @click="handleClose"></div>
        </div>
      </div>
    </div>
    <loading/>
  </div>
</template>

<script>
import helper from '../Helper/Helper'
import { mapActions, mapGetters } from "vuex";
import TicketForm from "./TicketForm.vue";
import ChangeFlight from './ChangeFlight.vue'
import Loading from '../../../../client/src/components/Loading.vue';
export default {
  name: "ManageTicket",
  components: { TicketForm, ChangeFlight, Loading, },
  data() {
    return {
      post: true,
      put: false,
      showTicket: false,
      ticketId: "",
    };
  },
  computed: {
    ...mapGetters(["allTickets"]),
  },
  methods: {
    ...mapActions(["deleteTicket"]),
    handleOpenForm(e, key) {
      this.$refs.form.scrollIntoView({ behavior: "smooth", block: "start" });
      this.showTicket = false;
      this.post = false;
      this.put = false;
      this[key] = true;
      if (key !== "post") {
        this.ticketId = e.target.parentNode.dataset.id;
      } else {
        this.ticketId = "";
      }
      console.log(this.ticketId, this.put ? 'put' : 'not',)
    },
    handleShow(e) {
      this.handleOpenForm(e, "showTicket");
    },
    handleShowFlight(id){
      this.$refs.form.scrollIntoView({ behavior: "smooth", block: "start" });
      this.showTicket = true;
      this.post = false;
      this.put = false;
      this.ticketId= id
    },
    handlePost(e) {
      this.handleOpenForm(e, "post");
    },
    handlePut(e) {
      this.handleOpenForm(e, "put");
    },
    async handleDelete(e) {
      const id = e.target.parentNode.dataset.id;
      const res = await this.deleteTicket(id);
      if (res.err) {
        console.log(res.err);
      } else {
        console.log(res.message);
      }
    },
    handleClose() {
      this.showTicket = false;
      this.post = true;
      this.put = false;
    },
    getNameDate(date){
      return helper.getDate(date)
    },

  },
};
</script>

<style scoped>
.ticket {
  background: #f7f7f8;
  min-height: 700px;
  padding: 20px 12px;
  padding-left: 30px;
  position: relative;
}
.ticket > h3 {
  text-align: center;
  padding-bottom: 12px;
  font-size: 24px;
  color: rgb(121, 107, 107);
}
.choose {
  font-size: 20px;
  padding: 0 0 10px;
  font-weight: 400;
}
.modal {
  position: fixed;
  right: 0;
  left: 0;
  bottom: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9;
}
.modal-body {
  position: absolute;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 11;
  background: #fff;
  padding: 25px 25px 30px;
  border-radius: 6px;
  overflow-y: auto;
  max-width: 320px;
  overflow-x: hidden;
}
.modal-title {
  text-align: center;
  padding-bottom: 8px;
  font-size: 18px;
  font-weight: 500;
}
.btn-close {
  position: absolute;
  right: 10px;
  top: 10px;
  color: red;
  font-size: 20px;
  width: 24px;
  height: 24px;
  text-shadow: 0 0 5px rgba(216, 38, 38, 0.8);
  transition: all 0.3s linear;
}
.btn-close:hover {
  cursor: pointer;
  color: #fff;
  background: rgba(216, 38, 38, 0.8);
  border-radius: 50%;
}
.btn-close::before {
  content: "x";
  position: absolute;
  top: -50%;
  left: 50%;
  transform: translate(-50%, 25%);
}
.close {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
}
.content-left {
  height: 420px;
  overflow-y: auto;
}
.content-left::-webkit-scrollbar {
  display: none;
}
.list{
  background: #fff;
}
.list-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
  padding-bottom: 16px;
  font-weight: 400;
}
.item {
  border: 1px solid #ccc;
  box-shadow: 2px 2px 6px #ccc;
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 4px;
}
.item-text {
  width: 50%;
  padding: 6px 12px 0;
  font-size: 14px;
  font-weight: 500;
  color: rgb(97, 85, 85);
}
.item-control {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 20px 0;
}
.btn {
  outline: none;
  background: #fff;
  padding: 6px 12px;
  margin-right: 12px;
  transition: all 0.3s linear;
  border-radius: 6px;
}
.btn--show {
  color: blue;
  border: 1px solid blue;
}
.btn--show:hover {
  background: blue;
  opacity: 0.8;
  color: #fff;
  cursor: pointer;
}
.btn--add {
  color: rgb(10, 177, 79);
  border: 1px solid rgb(10, 177, 79);
  font-size: 16px;
}
.btn--add:hover {
  background: rgb(10, 177, 79);
  opacity: 0.8;
  color: #fff;
  cursor: pointer;
}
.btn--change {
  color: rgb(255, 166, 0);
  border: 1px solid rgb(255, 166, 0);
}
.btn--change:hover {
  background: rgb(255, 166, 0);
  opacity: 0.8;
  color: #fff;
  cursor: pointer;
}
.btn--delete {
  color: red;
  border: 1px solid red;
}
.btn--delete:hover {
  background: red;
  opacity: 0.8;
  color: #fff;
  cursor: pointer;
}
</style>