<template>
  <footer class="footer">
      <nav>
        <ul class="footer-menu">
          <li>
            <router-link :to="{path:'/user/profile'}">Dashboard</router-link>
          </li>
        </ul>
      </nav>
      <div class="copyright text-center">
        &copy; Coded with
        <i class="fa fa-heart heart"></i> by
        <a href="/" target="_blank">Đặng Văn Hợi</a>
      </div>
  </footer>
</template>
<script>
  export default {}

</script>
<style scoped>
.footer{
  width: 100%;
  padding: 12px 12px;
  padding-left: 30px;
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #ccc;
}
.footer-menu{
  list-style: none;
}
a{
  color: blue;
}
</style>
