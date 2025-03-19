<script setup lang="ts">
// import { RouterLink, RouterView } from 'vue-router'
// import { useRouter } from 'vue-router'
import TalkInputBox from '@/components/ChatContainer/TalkInputBox.vue'
import ClientMessageBox from '@/components/ChatContainer/ClientMessageBox.vue'
import ServeMessageBox from '@/components/ChatContainer/ServeMessageBox.vue'

import ChangeMenuButton from '@/components/TopBar/ChangeMenuButton.vue'

import ReasonContainer from '@/components/ChatContainer/ReasonContainer.vue'
import { useChatInfoStore } from '@/stores/chatInfo'
import { onUpdated, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { debounce } from '@/utils/debounce'
import router from '@/router'

const chatStore = useChatInfoStore()
const { allChats, currentChatInfo, curretChatId } = storeToRefs(chatStore) //存储当前id所有对话信息
allChats.value = []
currentChatInfo.value.content = ''
currentChatInfo.value.id = undefined
const isLoaded = ref(true) //监控是否数据获取完成

// getChatInfo(Number(id.value)).then(() => {
//   console.log(currentChatInfo.value)
//   console.log(currentChatInfo.value?.topic)
//   title.value = currentChatInfo.value?.topic ? currentChatInfo.value?.topic : ''
//   allChats.value = [JSON.parse(currentChatInfo.value!.content)]

// })

//监听新id
watch(
  () => curretChatId.value,
  (newId) => {
    console.log(1231232121)
    router.push(`chat/${newId}`)
  },
)

//滑动函数
const bottomAnchor = ref()
const scrollToBottom = () => {
  bottomAnchor.value.scrollIntoView({ behavior: 'smooth' })
}
onUpdated(() => debounce(scrollToBottom(), 500))
// nextTick(() => {
//   scrollToBottom()
// });
</script>

<template>
  <div class="layout">
    <div class="topBar">
      <ChangeMenuButton></ChangeMenuButton>
      <n-button quaternary icon-placement="right">新对话</n-button>
    </div>
    <div class="messageContent">
      <div ref="bottomAnchor"></div>
      <div v-if="isLoaded">
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

      <div v-else>
        <n-space vertical>
          <n-skeleton height="2rem" width="20%" round />
          <n-skeleton height="2rem" width="33%" />
          <n-skeleton text :repeat="10" /> <n-skeleton text style="width: 60%" />
          <n-skeleton height="2rem" width="100%" :sharp="false" />
          <n-skeleton height="2rem" width="100%" :sharp="false" />
          <n-skeleton height="2rem" width="100%" :sharp="false" />
        </n-space>
      </div>
    </div>
    <div class="command"><TalkInputBox :isNew="true"></TalkInputBox></div>
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
  padding-bottom: 2rem;
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
  justify-content: space-between;
  flex-direction: column-reverse;
}
.messageContent::-webkit-scrollbar {
  width: 0;
  background: transparent;
}
</style>
