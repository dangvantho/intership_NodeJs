<template>
  <div class="listAdmin">
    <ul class="list">
      <li v-for="admin in allAdmin" :key="admin.id" class="item">
        <div class="item-info">
          <p>Tên đăng nhập: {{ admin.name }}</p>
          <p>Email: {{ admin.email }}</p>
        </div>
        <span class="delete" @click="()=>handleOpenAlert(admin.id)">Xóa</span>
      </li>
    </ul>
    <Alert 
      v-on:closeAlert="handleCloseAlert" 
      :deleteId="deleteId"
      v-if="alert" 
      message="Bạn có chắc chắn muốn xóa tài khoản admin này không" 
      title="Xác nhận xóa tài khoản"
      class="alert"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Alert from '../Alert'
export default {
  name: "ListAdmin",
  components:{ Alert },
  data() {
    return {
        alert: false,
        deleteId: null,
    };
  },
  computed: {
    ...mapGetters(["allAdmin"]),
  },
  methods: {
    ...mapActions(["deleteAdmin"]),
    handleOpenAlert(id){
        this.alert= true
        this.deleteId= id
    },
    handleCloseAlert(){
        this.deleteAdmin= null
        this.alert= false
    },
  },
};
</script>

<style scoped>
.list {
  background: #fff;
  list-style: none;
}
.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  border-bottom: 1px solid #ccc;
}
.delete {
  color: red;
  text-decoration: underline;
  opacity: 0.7;
  transition: all 0.3s ease-in;
}
.delete:hover {
  opacity: 1;
  cursor: pointer;
}
.alert{
height: 100%;
width: 100%;
}
</style>