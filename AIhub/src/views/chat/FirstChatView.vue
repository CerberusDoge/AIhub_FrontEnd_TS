<script setup lang="ts">
// import { RouterLink, RouterView } from 'vue-router'
import TalkInputBox from '@/components/TalkInputBox.vue'
</script>

<template>
  <div class="layout">
    <TalkInputBox></TalkInputBox>
  </div>
</template>

<style scoped lang="scss">
.layout {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
}
.el-container {
  height: 100%;
}
</style>
