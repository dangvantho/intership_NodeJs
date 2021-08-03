<template>
  <div class="wrapper">
    <div class="d-none d-md-block navbar-desktop" v-if="user.id">
      <div class="navbar">
        <MobileMenu />
      </div>
    </div>
    <div class="content">
      <TopNavbar v-if="user.id"/>
      <DashboardContent />
      <ContentFooter v-if="user.id"/>
    </div>
  </div>
</template>

<script>
import TopNavbar from "./TopNavbar.vue";
import ContentFooter from "./ContentFooter.vue";
import DashboardContent from "./Content.vue";
import MobileMenu from "./MobileMenu.vue";
import { mapGetters } from "vuex";
export default {
  components: {
    TopNavbar,
    ContentFooter,
    DashboardContent,
    MobileMenu,
  },
  created() {
    this.$store.dispatch("fetchTickets");
    this.$store.dispatch("fetchAirlines");
  },
  computed: {
    ...mapGetters(["user"]),
  },
  methods: {
    toggleSidebar() {},
  },
};
</script>
<style >
.wrapper {
  display: flex;
  justify-content: space-between;
}
.navbar-desktop {
  position: relative;
  width: 220px;
  overflow: visible;
}
.navbar {
  padding-top: 16px;
  background: url("https://demos.creative-tim.com/vue-light-bootstrap-dashboard-pro/static/img/sidebar-5.jpg")
    center / cover no-repeat;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  /* width:50px; */
  display: flex;
  z-index: 1;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
}
.navbar::before {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  opacity: 0.5;
  background: #000;
  z-index: 3;
}
.content {
  flex-grow: 1;
  position: relative;
  height: 100vh;
}
</style>
