<template>
  <ul class="nav" >
    <li class="nav-item">
      <router-link to="/user/profile" :class="{'nav-link': true, active: currentPage===0}"
        >
         <i class="rounded">{{fisrtLetter}}</i>
         {{user.name}}  
      </router-link
      >
    </li>
    <li class="nav-item">
      <router-link :class="{'nav-link': true, active: currentPage===1}" to="/">
      <i class="ti ti-pie-chart ti-icon"></i>
        Dashboard
      </router-link>
    </li>
    <li class="nav-item">
      <router-link :class="{'nav-link': true, active: currentPage===2}" to="/admin/manage-category">
      <i class="ti ti-panel ti-icon"></i>
        Quản lý danh mục
      </router-link>
    </li>
    <li class="nav-item">
      <router-link :class="{'nav-link': true, active: currentPage===3}" to="/admin/manage-ticket">
      <i class="ti ti-package ti-icon"></i>
        Quản lý thông tin vé
      </router-link>
    </li>
    <li class="nav-item">
      <router-link :class="{'nav-link': true, active: currentPage===4}" to="/admin/verify-order">
      <i class="ti ti-package ti-icon"></i>
        Xác nhận mua vé
      </router-link>
    </li>
  </ul>
</template>
<script>
import { mapGetters,  } from 'vuex';
export default {
  name: "mobile-menu",
  mounted(){
    this.getCurrentPage
  },
  data(){
    return {
      navbar: true,
      route:''
    }
  },
  computed:{
    ...mapGetters(['user','currentPage']),
    fisrtLetter(){
      return this.user.name?  this.user.name[0] : 'a'
    }
  },
  methods:{
    getCurrentPage(){
      console.log(this.$route,'curent')
    }
  },
};
</script>
<style scoped>
.nav {
  position: relative;
  list-style: none;
  animation: show 0.3s ease-in;
  overflow-y: auto;
  z-index: 9;
  
}
.nav-item {
  cursor: pointer;
  padding: 2px 16px;
}
.nav-link {
  /* background: #fff; */
  display: flex;
  justify-content: start;
  align-items: center;
  flex-wrap: nowrap;
  overflow: hidden;
  padding: 8px 4px;
  color: dodgerblue;
  text-decoration: none;
  color: #fff;
  border-radius: 4px;
  opacity: 0.5;
}
.nav-item:first-child{
  border-bottom: 1px solid #ccc;
  padding-bottom: 12px;
  margin-bottom: 12px;
}
.nav-link:hover {
  opacity: 0.81;
  background: rgba(250, 247, 247, 0.4);
}
.active{
  opacity: 0.8;
  background: rgba(250, 247, 247, 0.4);

}
.ti-icon{
  font-size: 18px;
  padding-right: 16px;
  font-weight: 600;
}

.rounded{
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: greenyellow;
  color: #fff;
  font-weight: 500;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  margin-right: 6px;
}
</style>
