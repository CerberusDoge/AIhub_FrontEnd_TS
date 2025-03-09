<script setup lang="ts">
import { inject } from 'vue'
import CollapseSider from '@/components/CollapseSider.vue'
const $axios = inject('$axios')
$axios
</script>

<template>
  <div class="main">
    <CollapseSider></CollapseSider>
    <div class="rightBar"><router-view></router-view></div>
  </div>
</template>

<style scoped lang="scss">
.main {
  display: flex;
  height: 100%;
  overflow: visible;
  .leftBar {
    display: flex;
    z-index: 1000;
    overflow: visible;
  }
  .rightBar {
    display: flex;
    background-color: white;
    align-items: center;
    justify-content: center;
    flex: 6.5 1 0;
  }
}

@media screen and (max-width: 768px) {
  .n-card {
    width: 90%;
    max-height: 100%;
  }
}
@media screen and (min-width: 769px) and (max-width: 1024px) {
  .n-card {
    width: 60%;
    max-height: 100%;
  }
}
@media screen and (min-width: 1025px) {
  .n-card {
    width: 30%;
    max-height: 100%;
  }
}
</style>
