<template>
  <div class="order-search">
    <div class="form-control">
      <input
        type="text"
        class="form-input"
        placeholder="Nhập mã đơn hàng"
        v-model="value"
      />
      <div class="submit" @click="handleSubmit">Tìm kiếm</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SearchOrder",
  data() {
    return {
      value: null,
    };
  },
  methods: {
    handleSubmit() {
      this.$router.push(`/order/search/${this.value}`);
    },
  },
};
</script>

<style scoped>
.order-search {
  padding-top: 40px;
}
.form-control {
  display: flex;
  justify-content: center;
}
.form-input {
  flex-grow: 1;
  max-width: 300px;
  border: 1px solid #ccc;
  outline: none;
  margin-right: 6px;
  padding: 6px 12px;
  border-radius: 6px;
}
.form-input:hover {
  border-color: blue;
}
.submit {
  padding: 6px 12px;
  background: rgb(19, 135, 243);
  opacity: 0.8;
  transition: opacity 0.3s ease-in;
  border-radius: 6px;
  color: #fff;
  font-weight: 500;
  font-size: 16px;
}
.submit {
  opacity: 1;
  cursor: pointer;
}
</style>