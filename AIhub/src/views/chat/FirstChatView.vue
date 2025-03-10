<script setup lang="ts">
// import { RouterLink, RouterView } from 'vue-router'
import TalkInputBox from '@/components/TalkInputBox.vue'
import ClientmessageBox from '@/components/ClientmessageBox.vue'
const testMessage="asdasasdasdasd1`asdasdadadasda`asdasasdasdasd1`asdasasdasdasd1asdasasdasdasd1asdasasdasdasd1asdasasdasdasd1asdasasdasdasd1asdasasdasdasd1asdasasdasdasd1asdasasdasdasd1asdasasdasdasd1asdasasdasdasd1asdasasdasdasd1asdasasdasdasd1asdasasdasdasd1asdasasdasdasd1asdasasdasdasd1vasdasdadadasda`asdasasdasdasd1`asdasdadadasda`asdasasdasdasd1`asdasdadadasda`"
</script>

<template>
  <div class="layout">
    <div class="messageContent">
      <ClientmessageBox>{{testMessage}}</ClientmessageBox>
            <ClientmessageBox></ClientmessageBox>
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
  overflow-y: auto;  /* 垂直滚动条自动显示 */
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
