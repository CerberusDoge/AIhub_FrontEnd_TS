<script setup lang="ts">
// import { RouterLink, RouterView } from 'vue-router'
import { ref } from 'vue'
import { ArrowUp as Arrow } from '@vicons/ionicons5'
import { fetchRequest } from '@/services/sse'
import type { ChatRequest } from '@/types/message'
import { useChatInfoStore } from '@/stores/chatInfo'
import { storeToRefs } from 'pinia'

enum Model {
  DeepseekR1 = 'deepseek-r1',
  Doubao15Pro = 'doubao-1.5pro',
}

const chatStore = useChatInfoStore()
chatStore.inputBoxInfo = ''

// const storeInput = (value: any) => {
//   chatStore.inputBoxInfo = value
//   console.log(chatStore.inputBoxInfo)
// }

const loadingRef = ref(false)
const storeData = ref('')
const chatRequest = ref<ChatRequest>({
  chatInfoId: null,
  model: Model.DeepseekR1,
  prompt: '',
  message: '一句话介绍vue3',
})
const standify = (
  chatId: number | null,
  model: Model,
  prompt: string,
  message: string,
): ChatRequest => {
  return {
    chatInfoId: chatId,
    model: model,
    prompt: prompt,
    message: message,
  }
}
const sendMessage = async () => {
  if (chatStore.inputBoxInfo.trim() !== '') {
    chatStore.isSendMessage = true
    fetchRequest(standify(null, Model.DeepseekR1, '', chatStore.inputBoxInfo))
    console.log('发送消息成功')
  }
}

const input = ref('')
</script>

<template>
  <div class="inputBox">
    <n-input
      @keyup.native.enter="sendMessage"
      v-model:value="chatStore.inputBoxInfo"
      show-count
      id="typeIn"
      type="textarea"
      round
      clearable
      placeholder="询问任何问题"
      :autosize="{
        minRows: 2,
        maxRows: 4,
      }"
    />
    <div class="bottomContent">
      <!-- <button @click="handleClick">jasdasldl</button> -->
      <n-button circle :loading="loadingRef" @click="sendMessage" color="#5FBD22">
        <template #icon>
          <n-icon>
            <Arrow />
          </n-icon>
        </template>
      </n-button>
    </div>

    <!-- <input type="text"  v-model="input" placeholder="询问任何问题" /> -->
  </div>
</template>

<style scoped lang="scss">
::v-deep(.n-input__border) {
  display: none; /* 直接隐藏边框层 */
}

/* 深度选择器应对scoped样式 */
:deep(.n-input) {
  --n-border-focus: transparent !important;
  --n-box-shadow-focus: none !important;
}

.inputBox {
  font-size: 1rem;
  line-height: 1.5rem;
  border: 0 solid #e3e3e3;
  box-sizing: border-box;
  max-height: 20rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 80%;
  cursor: text;
  flex-direction: column;
  border-radius: 1.5rem;
  border-width: 1px;
  border-color: vars.$border-light;
  box-shadow: vars.$box-shadow;
  padding-top: 0.8rem;
  padding-left: 0.8rem;
  padding-right: 0.8rem;
  padding-bottom: 0.7rem;
}

#typeIn {
  width: 70vw;
  font-family: vars.$font-family;
  font-size: vars.$font-size-normal;
  border: none;
  color: black;
  resize: none;
  outline: none;
  margin-bottom: 10px;
}
.bottomContent {
  display: flex;
  justify-content: end;
}
</style>
