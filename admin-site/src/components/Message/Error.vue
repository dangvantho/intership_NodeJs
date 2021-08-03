<template>
  <div class="toast">
    <div class="toast__body" style="color: red">
      <img :src="error" class="toast--img toast--error" />
      {{ content }}
      <!-- <img :src="close" class="toast--img toast--closed"> -->
    </div>
  </div>
</template>

<script>
import error from "../../assets/error.svg";
export default {
  name: "Error",
  props: ["content"],
  data() {
    return {
      error,
    };
  },
};
</script>

<style>
.toast--error {
  padding-right: 8px;
}
</style>