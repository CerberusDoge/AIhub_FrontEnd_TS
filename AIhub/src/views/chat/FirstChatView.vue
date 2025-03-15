<script setup lang="ts">
// import { RouterLink, RouterView } from 'vue-router'
import { useRouter } from 'vue-router'
import TalkInputBox from '@/components/TalkInputBox.vue'
import ClientMessageBox from '@/components/ClientMessageBox.vue'
import ServeMessageBox from '@/components/ServeMessageBox.vue'
import TopBar from '@/components/TopBar.vue'
import { refreshToken } from '@/services/refresh'
import { delChat, star, unStar } from '@/services/chat'
import { chatInfoStore } from '@/stores/chatInfo'
import { ref, watch } from 'vue'

const chatStore = chatInfoStore()
const currentTextMessage = ref('')
const router = useRouter()

const title = '啊实打实打算啊实adsaasdasdassa打实大苏打撒'
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
</script>

<template>
  <div class="layout">
    <div class="topBar"><TopBar :title="title"></TopBar></div>
    <div class="messageContent">
      <ServeMessageBox :messages="currentTextMessage"></ServeMessageBox>
      <ClientMessageBox :messages="currentTextMessage"></ClientMessageBox>
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
.topBar {
  display: flex;
  justify-content: start;
  width: 96%;
  max-width: 100%;
  padding: 1rem;
  padding-left: 0;
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
  max-width: 100%;
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
