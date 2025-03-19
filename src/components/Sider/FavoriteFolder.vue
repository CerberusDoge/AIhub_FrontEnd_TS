<script setup lang="ts">
import { useUserStore } from '@/stores/userInfo'
import { useChatInfoStore } from '@/stores/chatInfo'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
const router = useRouter()
const chatInfo = useUserStore()
const { userStars } = storeToRefs(chatInfo)
const ChatInfoStore = useChatInfoStore()
const goTo = (id: number) => {
  router.push(`/chat/${id}`)
}
</script>
<template>
  <div class="main" style="max-height: 20rem">
    <div
      v-for="(val, index) in userStars"
      :key="index"
      class="row"
      :class="{ rowChosen: val.id === ChatInfoStore.currentChatInfo.id }"
      @click="goTo(val.id!)"
    >
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
  align-items: center;
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
  transition-duration: 0.4s;
  -webkit-transition-duration: 0.4s;
}
.row:hover {
  background-color: vars.$grey;
}
.rowChosen {
  background-color: rgb(250, 250, 250);
  margin-bottom: 0.6rem;
  width: 13rem;
  padding: 0.5rem;
  max-width: 90%;
  // background: linear-gradient(145deg, #e9f0df, #d4eacc);
  box-shadow:
    3px 3px 6px #b5b5b5,
    -3px -3px 6px #dfdede;
  border-radius: 0.7rem;
  display: flex;
  align-items: center;
  transition-duration: 0.4s;
  -webkit-transition-duration: 0.4s;
}
.rowChosen:hover {
  background-color: rgb(255, 255, 255);
}
.rowTitle {
  width: 100%;
  margin-left: 0.5rem;
  white-space: nowrap; /* 禁止换行 */
  text-overflow: ellipsis;
}
</style>
