<script setup lang="ts">
import { useUserStore } from '@/stores/userInfo'
import { storeToRefs } from 'pinia'
const chatInfo = useUserStore()
const { userChatInfos } = storeToRefs(chatInfo)
</script>
<template>
  <n-config-provider
    :theme-overrides="{
      Scrollbar: {
        width: '0px',
      },
    }"
  >
    <n-scrollbar trigger="hover" style="max-height: 20rem">
      <div v-for="(val, index) in userChatInfos" :key="index" class="row" :value="val.id">
        <div class="rowTitle">{{ val.topic }}</div>
      </div>
    </n-scrollbar>
  </n-config-provider>
</template>
<style scoped lang="scss">
.main {
  overflow-x: hidden;
  overflow-y: auto;
  max-height: 20rem;
}
.row {
  margin-bottom: 0.6rem;
  width: 15rem;
  padding: 0.5rem;
  max-width: 90%;
  background-color:  vars.$deepGrey vars.$grey;
  border-radius: 0.7rem;
  display: flex;
  align-items: center;
  transition: border 0.3s ease;
  .rowTitle {
    margin-left: 0.5rem;
    white-space: nowrap; /* 禁止换行 */
    text-overflow: ellipsis;
  }
}

.row:hover {
  background-color: vars.$grey;
}
</style>
