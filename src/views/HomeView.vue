<script setup lang="ts">
import CollapseSider from '@/components/Sider/CollapseSider.vue'
import { useMenuStore } from '@/stores/menuInfo'
import { getUserInfo } from '@/services/user'
const menuInfo = useMenuStore()
getUserInfo()
</script>

<template>
  <div class="main">
    <Transition name="slide"
      ><div class="sider" v-show="menuInfo.isDisplay"><CollapseSider></CollapseSider></div
    ></Transition>
    <div class="rightBar"><router-view></router-view></div>
  </div>
</template>

<style scoped lang="scss">
.main {
  display: flex;
  height: 100%;
  overflow: visible;
  .sider {
    background-color: vars.$dimGrey;
    display: flex;
    max-height: 100%;
    padding: 0.4rem 1rem 1rem 1rem;
    user-select: none;
  }
  .rightBar {
    display: flex;
    background-color: white;
    align-items: center;
    justify-content: center;
    flex: 6.5 1 0;
  }
}

.topBotton {
  padding: 0.8rem;
  padding-left: 2rem;
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
