<template>
  <div class="app">
    <DashboardLayout/>
  </div>
</template>

<script>
import DashboardLayout from './components/Layouts/DashboardLayout'
import { mapGetters } from 'vuex';

export default {
  name: "App",
  components: {
    DashboardLayout
  },
  computed:{
    ...mapGetters(['user']),
  }
};
</script>

<style >
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  font-size: 14px;
}
body::-webkit-scrollbar {
  display: none;
}
.content {
  min-height: 300px;
}
.text{
  font-size: 16px;
  font-weight: 500;
}
.text span{
  color: rgb(247, 63, 63);
}
.bg-white{
  background: #fff ;
}
</style>
