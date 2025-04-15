<script setup lang="ts">
// import { RouterLink, RouterView } from 'vue-router'
// import { useRouter } from 'vue-router'
import TalkInputBox from '@/components/ChatContainer/TalkInputBox.vue'
import ClientMessageBox from '@/components/ChatContainer/ClientMessageBox.vue'
import ServeMessageBox from '@/components/ChatContainer/ServeMessageBox.vue'

import ChangeMenuButton from '@/components/TopBar/ChangeMenuButton.vue'

import ReasonContainer from '@/components/ChatContainer/ReasonContainer.vue'
import { useChatInfoStore } from '@/stores/chatInfo'
import { onBeforeUnmount, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import router from '@/router'

const chatStore = useChatInfoStore()
const { allChats, currentChatInfo, curretChatId, isSST } = storeToRefs(chatStore) //存储当前id所有对话信息
allChats.value = []
currentChatInfo.value.content = ''
currentChatInfo.value.id = undefined
const isLoaded = ref(true) //监控是否数据获取完成
onBeforeUnmount(() => {
  isSST.value = false
})
//监听新id
watch(
  () => curretChatId.value,
  (newId) => {
    console.log(newId)
    router.push(`chat/${newId}`)
  },
)
const isSend = ref(false)
const handleInput = (data) => {
  isSend.value = data
}
</script>

<template>
  <div class="layout">
    <div class="topBar">
      <ChangeMenuButton></ChangeMenuButton>
      <n-button quaternary icon-placement="right">新对话</n-button>
    </div>
    <div class="decorate" v-if="!isSend">
      <img class="prompt" src="../../assets/img/helloWorld.png" alt="" />
    </div>
    <div class="messageContent">
      <div ref="bottomAnchor"></div>
      <div class="contentList" v-if="isLoaded">
        <div v-for="(val, index) in allChats" :key="index">
          <ServeMessageBox
            v-if="val.role === 'assistant' && val.content"
            :isNew="val.isNew ? true : false"
            :messages="val.reasoning_content ? val.reasoning_content : val.content!"
          ></ServeMessageBox>
          <ReasonContainer
            v-else-if="val.role === 'assistant' && val.reasoning_content"
            :isNew="val.isNew ? true : false"
            :messages="val.reasoning_content ? val.reasoning_content : val.content!"
          ></ReasonContainer>
          <ClientMessageBox
            v-else-if="val.role === 'user' && val.content"
            :messages="val.content!"
          ></ClientMessageBox>
        </div>
      </div>
    </div>
    <div class="command">
      <TalkInputBox :isNew="true" @isSended="handleInput"></TalkInputBox>
    </div>
  </div>
</template>

<style scoped lang="scss">
.decorate {
  display: flex;
  position: fixed;
  bottom: 8rem;
}
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
  padding-bottom: 2rem;
}
.messageContent {
  overflow-y: auto; /* 垂直滚动条自动显示 */
  overflow-x: hidden;
  max-height: 100%;
  max-width: 100%;
  width: 100%;

  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column-reverse;
}
.messageContent::-webkit-scrollbar {
  width: 0;
  background: transparent;
}

.contentList {
  width: 70%;
  max-width: 70%;
}
.prompt {
  user-select: none;
  width: 34rem;
}
@media screen and (max-width: 768px) {
  .topBar {
    max-width: 90%;
    padding-left: 0.6rem;
    padding-top: 0.6rem;
  }
  .command {
    padding-bottom: 1.2rem;
    width: 90%;
  }
  .contentList {
    width: 90%;
    max-width: 95%;
  }
  .prompt {
    width: 24rem;
  }
}
</style>
