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
import { onBeforeUnmount, onUpdated, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { throttle } from '@/utils/debounce'
import { switchDataToClientMsg } from '@/services/chat'
import { getUserInfo } from '@/services/user'

const route = useRoute()
const chatStore = useChatInfoStore()
const { currentChatInfo, cacheinputBoxInfo, allChats, controller, signal, isSending } =
  storeToRefs(chatStore)
const title = ref('') //存储标题
const id = ref(route.params.id) //存储现在的id
const isLoaded = ref(false) //监控是否渲染完成

onBeforeUnmount(() => {
  isSending.value = false
  console.log(1111111)
  controller.value.abort() //中止
  controller.value = new AbortController() //重置中止控制器
  signal.value = controller.value.signal //重新赋值信号
})

getUserInfo()
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
    isSending.value = false
    controller.value.abort() //中止
    controller.value = new AbortController() //重置中止控制器
    signal.value = controller.value.signal //重新赋值信号

    isLoaded.value = false
    id.value = newId
    getChatInfo(Number(id.value)).then(() => {
      title.value = currentChatInfo.value?.topic ? currentChatInfo.value?.topic : '123'
      allChats.value = JSON.parse(currentChatInfo.value!.content)
      console.log(allChats.value)
      isLoaded.value = true
      console.log(isLoaded.value)
    })
    getUserInfo()
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
  width: 70%;
  max-width: 65%;
}
.contentListSketch {
  width: 70%;
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
}
</style>
