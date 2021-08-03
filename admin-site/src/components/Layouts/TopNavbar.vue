<template>
  <div class='top-navbar justify-content-between justify-content-md-end'>
      <div class='d-block d-md-none'>
        <i class='ti ti-menu-alt ti-icon'></i>
      </div>
    <div class='d-flex align-items-center logout' @click="handleLogout">
        <i class="ti ti-power-off pe-2 ti-icon"></i>
        <span>Logout</span>
    </div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
  export default {
    computed: {
      routeName () {
        const {name} = this.$route
        return this.capitalizeFirstLetter(name)
      }
    },
    data () {
      return {
        activeNotifications: false
      }
    },
    methods: {
      ...mapMutations(['LOG_OUT']),
      handleLogout(){
        this.LOG_OUT()
        this.$router.push('/login')
      }
    },

  }

</script>
<style scoped>
.top-navbar{
  display: flex;
  font-size: 15px;
  font-weight: 500;
  align-items: center;
  border-bottom: 1px solid #ccc;
  padding: 12px 20px;
}
.ti-icon:hover, .logout:hover{
  color: rgb(16, 225, 240);
  cursor: pointer;
}
</style>
