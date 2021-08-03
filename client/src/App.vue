<template>
  <div class="app">
    <Header />
    <div class="content">
      <router-view></router-view>
    </div>
    <Footer />
  </div>
</template>

<script>
import Header from "./components/Layouts/Header";
import Footer from "./components/Layouts/Footer.vue";

export default {
  name: "App",
  components: {
    Header,
    Footer,
  },
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
</style>
