<script setup lang="ts">
import { BookmarkOutline, DiceOutline, FolderOutline, Menu, Add } from '@vicons/ionicons5'
import { NIcon } from 'naive-ui'
import { defineComponent, h, ref } from 'vue'
import type { Component } from 'vue'
import { RouterLink } from 'vue-router'

const topList=[{icon:Add,title:'新对话'}]
function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}
</script>

<template>
  <!-- <n-switch v-model:value="collapsed" /> -->
  <div class="wrap">
    <div class="top">
      <div class="topTitle">
        <div>AIhub</div>
        <n-button quaternary circle type="primary">
          <template #icon>
            <n-icon size="1.8rem"><Menu /></n-icon>
          </template>
        </n-button>
      </div>
      <div v-for="(val,index) in topList ":key=index class="row">
        <component :is="renderIcon(val.icon)" />
        <div class="rowTitle">{{val.title}}</div>
        </div>

    </div>
    <div class="bottom">123</div>
  </div>
</template>

<style scoped lang="scss">
.wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  max-height: 100%;
  width: 100%;
}
.top {
  display: flex;
  width: 100%;
  flex-direction: column;
  .topTitle {
    font-size: 1.1rem;
    font-weight: bold;
    margin: 0.1rem 0;
    display: flex;
    justify-content: space-between;
    padding: 0.4rem;
    align-items: center;
  }

  .row {
    margin-bottom: 0.6rem;
    width: 15rem;
    padding: 0.5rem;
    max-width: 100%;
    background-color: vars.$grey;
    border-radius: 0.7rem;
    display: flex;
    align-items: center;
    .rowTitle {
      margin-left: 0.5rem;
    }
  }
}
</style>
