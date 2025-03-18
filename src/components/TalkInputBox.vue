<!-- eslint-disable vue/no-deprecated-v-on-native-modifier -->
<!-- eslint-disable vue/no-deprecated-v-on-native-modifier -->
<!-- eslint-disable vue/no-deprecated-v-on-native-modifier -->
<!-- eslint-disable vue/no-deprecated-v-on-native-modifier -->
<!-- eslint-disable vue/no-deprecated-v-on-native-modifier -->
<!-- eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain -->
<script setup lang="ts">
// import { RouterLink, RouterView } from 'vue-router'
import { ref, watch } from 'vue'
import { ArrowUp as Arrow } from '@vicons/ionicons5'
import { fetchRequest } from '@/services/sse'
import type { ChatRequest } from '@/types/message'
import { useChatInfoStore } from '@/stores/chatInfo'
import { storeToRefs } from 'pinia'
import { switchDataToClientMsg } from '@/services/chat'

import { NIcon } from 'naive-ui'
import type { SelectGroupOption, SelectOption } from 'naive-ui'

const props = defineProps<{ isNew: boolean }>()

enum Model {
  DeepseekR1 = 'deepseek-r1',
  Doubao15Pro = 'doubao-1.5pro',
}
const chatStore = useChatInfoStore()
chatStore.inputBoxInfo = '' //输入框内容
const { currentChatInfo, allChats } = storeToRefs(chatStore)

//判断模型选择框内容函数
const chosenModel = ref<Model>() //已选的模型
const returnOption = (isNew: boolean): Array<SelectOption | SelectGroupOption> => {
  // eslint-disable-next-line prefer-const
  let options = [
    {
      label: 'deepseek-r1',
      value: `${Model.DeepseekR1}`,
      disabled: currentChatInfo.value?.model != Model.DeepseekR1,
    },
    {
      label: 'doubao-1.5pro',
      value: `${Model.Doubao15Pro}`,
      disabled: currentChatInfo.value?.model != Model.Doubao15Pro,
    },
  ]
  if (isNew) {
    chosenModel.value = Model.Doubao15Pro
    options[0].disabled = false
    options[1].disabled = false
  } else {
    chosenModel.value = currentChatInfo.value?.model
  }
  return options
}

const options = ref<Array<SelectOption | SelectGroupOption>>(returnOption(props.isNew))
watch(
  () => currentChatInfo.value?.model,
  () => {
    if (!props.isNew) {
      options.value = returnOption(props.isNew)
    }
  },
)

const loadingRef = ref(false)
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
  const inputBoxInfo = chatStore.inputBoxInfo.trim()
  chatStore.inputBoxInfo = ''
  if (inputBoxInfo !== '') {
    allChats.value!.push(switchDataToClientMsg(inputBoxInfo))
    fetchRequest(
      standify(
        currentChatInfo.value?.id ? currentChatInfo.value?.id : null,
        currentChatInfo.value?.model!,
        '',
        inputBoxInfo,
      ),
    ).then(() => {
      if (props.isNew) {
      }
    }) //发送sse渲染请求
  }
}
</script>

<template>
  <div class="inputBox">
    <n-input
      no-deprecated-v-on-native-modifier
      eslint-disable-next-line
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
      <n-select
        class="selector"
        v-model:value="chosenModel"
        :options="options"
        placeholder="请选择模型"
      >
        <template #header> 大语言模型 </template></n-select
      >
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
  padding-left: 0.9rem;
  padding-right: 0.9rem;
  padding-bottom: 0.9rem;
}
.selector {
  border-radius: 1rem;
  width: 14rem;
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
  justify-content: space-between;
}
</style>
