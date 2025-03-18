<script setup lang="ts">
const num:number=1
</script>

<template>
   <n-message-provider :max=num>
  <router-view></router-view>
</n-message-provider>
</template>

<style scoped lang="scss">

</style>
