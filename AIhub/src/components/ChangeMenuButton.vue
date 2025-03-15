<script setup lang="ts">
import { NIcon } from 'naive-ui'
import { OptionsOutline as Menu } from '@vicons/ionicons5'

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
        <n-icon color="#5FBD22" size="1.5rem"><Menu /></n-icon>
      </template>
    </n-button>
  </div>
</template>

<style scoped></style>
