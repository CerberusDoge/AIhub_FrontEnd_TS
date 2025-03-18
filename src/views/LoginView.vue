<script setup lang="ts">
import FormLogin from '@/components/FormLogin.vue'

</script>

<template>
  <div class="wrap">
    <n-card title="AIHUB" hoverable>
      <template #header-extra> Alpha </template>
      <n-message-provider :max="1"><FormLogin></FormLogin></n-message-provider>
    </n-card>
  </div>
</template>

<style scoped lang="scss">
.wrap {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
}
.n-card {
  width: 40vw;
  max-height: 80vw;
}
@media screen and (max-width: 500px) {
  .n-card {
    width: 90%;
    max-height: 100%;
  }
}
@media screen and (min-width: 501px) and (max-width: 878px) {
  .n-card {
    width: 60%;
    max-height: 100%;
  }
}
@media screen and (min-width: 879px) {
  .n-card {
    width: 30%;
    max-height: 100%;
  }
}
</style>
