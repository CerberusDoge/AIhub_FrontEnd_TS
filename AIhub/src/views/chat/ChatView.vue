<script setup lang="ts">
// import { RouterLink, RouterView } from 'vue-router'
import { useRoute } from 'vue-router'
import TalkInputBox from '@/components/TalkInputBox.vue'
import ClientMessageBox from '@/components/ClientMessageBox.vue'
import ServeMessageBox from '@/components/ServeMessageBox.vue'
import TopBar from '@/components/TopBar.vue'
import type { ContentDetail } from '@/types/message'
import ReasonContainer from '@/components/ReasonContainer.vue'
import { useChatInfoStore } from '@/stores/chatInfo'
import { getChatInfo } from '@/services/chat'
import { onMounted, onUpdated, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { nextTick } from 'vue'
import { debounce } from '@/utils/debounce'

const route = useRoute()
const chatStore = useChatInfoStore()
const { currentChatInfo } = storeToRefs(chatStore)
const title = ref('') //存储标题
const id = ref(route.params.id) //存储现在的id
const { allChats } = storeToRefs(chatStore) //存储当前id所有对话信息

const isLoaded = ref(false) //监控是否渲染完成

getChatInfo(Number(id.value)).then(() => {
  console.log(currentChatInfo.value)
  console.log(currentChatInfo.value?.topic)
  title.value = currentChatInfo.value?.topic ? currentChatInfo.value?.topic : ''
  allChats.value = JSON.parse(currentChatInfo.value!.content)
  isLoaded.value = true
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
    <div class="topBar"><TopBar :title="title"></TopBar></div>
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
    <div class="command"><TalkInputBox :isNew=false></TalkInputBox></div>
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
  flex-direction: column-reverse;
}
.messageContent::-webkit-scrollbar {
  width: 0;
  background: transparent;
}
</style>
