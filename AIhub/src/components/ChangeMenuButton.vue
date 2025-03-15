<script setup lang="ts">
import { NIcon } from 'naive-ui'
import { OptionsOutline ,Book as Menu } from '@vicons/ionicons5'

import { useMenuStore } from '@/stores/menuInfo'
const menuInfo = useMenuStore()
const changeMenu = () => {
  menuInfo.isDisplay = !menuInfo.isDisplay
}
</script>

<template>
  <div class="topBotton" v-show="!menuInfo.isDisplay">

    <n-button quaternary circle type="primary" @click="changeMenu">
      <template #icon>
        <n-icon color="#5FBD22" size="1.4rem"><Menu /></n-icon>
      </template>
    </n-button>
  </div>
</template>

<style scoped>
.topBotton
{
  padding:0 0.2rem
}
</style>
