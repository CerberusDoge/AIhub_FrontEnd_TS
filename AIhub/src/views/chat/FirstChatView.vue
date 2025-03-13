<script setup lang="ts">
// import { RouterLink, RouterView } from 'vue-router'
import { useRouter } from 'vue-router'
import TalkInputBox from '@/components/TalkInputBox.vue'
import ClientMessageBox from '@/components/ClientMessageBox.vue'
import ServeMessageBox from '@/components/ServeMessageBox.vue'
import { refreshToken } from '@/services/refresh'
import { delChat, star, unStar } from '@/services/chat'
import { chatInfoStore } from '@/stores/chatInfo'
import { ref, watch } from 'vue'

const chatStore = chatInfoStore()
const currentTextMessage = ref('')
const router = useRouter()
const logOut = () => {
  localStorage.clear()
  router.push('/login')
}

const refresh = refreshToken
const deleteChat = () => {
  delChat(14)
}
const starChat = () => {
  star(14, 1)
}
const unStarChat = () => {
  unStar(1, 1)
}

//监听是否有新消息
watch(
  () => chatStore.isSendMessage,
  (newValue: boolean) => {
    if (newValue === true) {
      currentTextMessage.value = chatStore.inputBoxInfo
      chatStore.isSendMessage = false
    }
  },
)

// watch(()=>chatStore.inputBoxInfo, (newValue:string) => {
//   // 当 watchedValue 变化时，更新 inputValue
//   storeNew.value=chatStore.inputBoxInfo
// });
</script>

<template>
  <div class="layout">
    <button @click="logOut">logOut</button>
    <button @click="refresh">refrshToken</button>
    <button @click="deleteChat">delete</button>
    <button @click="starChat">star</button>
    <button @click="unStarChat">unstar</button>
    <div class="messageContent">

      <ClientMessageBox>{{ currentTextMessage }}</ClientMessageBox>
      <ServeMessageBox :messages="currentTextMessage"></ServeMessageBox>
      <ClientMessageBox>{{ currentTextMessage }}</ClientMessageBox>
    </div>
    <div class="command"><TalkInputBox></TalkInputBox></div>
  </div>
</template>

<style scoped lang="scss">
.layout {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  justify-content: end;
  align-items: center;
}

.command {
  // background-color: pink;

  display: flex;
  justify-content: center;
  padding-bottom: 2%;
}
.messageContent {
  overflow-y: auto; /* 垂直滚动条自动显示 */
  overflow-x: hidden;
  max-height: 100%;
  width: 60%;
  padding: 2%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.messageContent::-webkit-scrollbar {
  width: 0;
  background: transparent;
}
</style>
