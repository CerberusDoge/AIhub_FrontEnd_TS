<script setup lang="ts">
import { useUserStore } from '@/stores/userInfo'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
const router = useRouter()
const chatInfo = useUserStore()
const { userStars } = storeToRefs(chatInfo)

const goTo = (id: number) => {
  router.push(`/chat/${id}`)
}
</script>
<template>
  <div class="main" style="max-height: 20rem">
    <div v-for="(val, index) in userStars" :key="index" class="row" @click="goTo(val.id!)">
      <div class="rowTitle">
        {{ val.topic }}
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.main::-webkit-scrollbar {
  display: none;
}
.main {
  display: flex;
  flex-direction: column;
  align-items:center;
  overflow-x: hidden;
  overflow-y: auto;
  max-height: 20rem;
}
.row {
  margin-bottom: 0.6rem;
  width: 15rem;
  padding: 0.5rem;
  max-width: 90%;
  background-color: vars.$deepGrey vars.$grey;
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
