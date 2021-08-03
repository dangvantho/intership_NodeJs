<template>
  <div class="notfound">
    <img :src="img" alt="Giỏ hàng trống" />
  </div>
</template>

<script>
import empty_cart from "../../assets/empty-cart.png";
import { mapGetters } from "vuex";
export default {
  name: "Booking404",
  created() {
    this.redirect();
  },
  data() {
    return {
      img: empty_cart,
    };
  },
  computed: {
    ...mapGetters(["bookingTicket"]),
  },
  methods: {
    redirect() {
      if (this.bookingTicket.id) {
        this.$router.push("/booking");
      }
    },
  },
};
</script>

<style>
.notfound {
  background: rgb(238, 238, 238);
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  overflow: hidden;
}
.notfound img {
  object-fit: contain;
  width: 100%;
  max-height: 350px;
}
</style>