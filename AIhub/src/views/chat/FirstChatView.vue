<script setup lang="ts">
// import { RouterLink, RouterView } from 'vue-router'
import { useRouter } from 'vue-router'
import TalkInputBox from '@/components/TalkInputBox.vue'
import ClientMessageBox from '@/components/ClientMessageBox.vue'
import { refreshToken } from '@/services/refresh'
const router = useRouter()
const logOut = () => {
  localStorage.clear()
  router.push('/login')
}

const refresh = refreshToken
const testMessage =
  'asdasd1asasdsd1asdasasdasdasdasd1asdasasdasdasd1asdasasdasdasd1asdasasdd1asdasasdasdasd1asdasasdasdasd1vasdasdadadasda`asdasasdasdasd1`asdasdadadasda`asdasasdasdasd1`asdasdadadasda`'
</script>

<template>
  <button @click="logOut">logOut</button>
  <button @click="refresh">refrshToken</button>
  <div class="layout">
    <div class="messageContent">
      <ClientMessageBox>{{ testMessage }}</ClientMessageBox>
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
