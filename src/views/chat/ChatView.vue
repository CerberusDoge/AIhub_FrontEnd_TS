<script setup lang="ts">
// import { RouterLink, RouterView } from 'vue-router'
import { useRoute } from 'vue-router'
import TalkInputBox from '@/components/ChatContainer/TalkInputBox.vue'
import ClientMessageBox from '@/components/ChatContainer/ClientMessageBox.vue'
import ServeMessageBox from '@/components/ChatContainer/ServeMessageBox.vue'
import TopBar from '@/components/TopBar/TopBar.vue'
import ReasonContainer from '@/components/ChatContainer/ReasonContainer.vue'
import { useChatInfoStore } from '@/stores/chatInfo'
import { getChatInfo } from '@/services/chat'
import { onUpdated, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { throttle } from '@/utils/debounce'
import { switchDataToClientMsg } from '@/services/chat'

const route = useRoute()
const chatStore = useChatInfoStore()
const { currentChatInfo, cacheinputBoxInfo, allChats } = storeToRefs(chatStore)
const title = ref('') //存储标题
const id = ref(route.params.id) //存储现在的id

const isLoaded = ref(false) //监控是否渲染完成

getChatInfo(Number(id.value)).then(() => {
  console.log(currentChatInfo.value)
  console.log(currentChatInfo.value?.topic)
  title.value = currentChatInfo.value?.topic ? currentChatInfo.value?.topic : ''
  allChats.value = JSON.parse(currentChatInfo.value!.content)
  if (cacheinputBoxInfo.value !== '') {
    allChats!.value!.push(switchDataToClientMsg(cacheinputBoxInfo.value))
  }
  isLoaded.value = true
  cacheinputBoxInfo.value = ''
})

//监听新id
watch(
  () => route.params.id,
  (newId) => {
    isLoaded.value = false
    id.value = newId
    getChatInfo(Number(id.value)).then(() => {
      title.value = currentChatInfo.value?.topic ? currentChatInfo.value?.topic : '123'
      allChats.value = JSON.parse(currentChatInfo.value!.content)
      console.log(allChats.value)
      isLoaded.value = true
      console.log(isLoaded.value)
    })
  },
)

//滑动函数
const autoScroll = ref(true)
const handleInput = (data) => {
  autoScroll.value = data
}
const bottomAnchor = ref()
const handleWheel = () => {
  autoScroll.value = false
}
const scrollToBottom = () => {
  bottomAnchor.value.scrollIntoView({ behavior: 'smooth' })
}
onUpdated(() => {
  console.log(autoScroll.value)
  if (autoScroll.value) throttle(scrollToBottom, 500)()
})
// nextTick(() => {
//   scrollToBottom()
// });
</script>

<template>
  <div class="layout">
    <div class="topBar"><TopBar :title="title"></TopBar></div>
    <div class="messageContent" @wheel="handleWheel">
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
    <div class="command"><TalkInputBox :isNew="false" @isSended="handleInput"></TalkInputBox></div>
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
  padding-bottom: 0;
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

.contentList {
  max-width: 60%;
}
// .messageContent::-webkit-scrollbar {
//   width: 0;
//   background: transparent;
// }

/* 创建滚动条轨道 */
</style>
