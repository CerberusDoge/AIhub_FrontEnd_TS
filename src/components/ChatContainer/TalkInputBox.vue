<!-- eslint-disable vue/no-deprecated-v-on-native-modifier -->
<!-- eslint-disable vue/no-deprecated-v-on-native-modifier -->
<!-- eslint-disable vue/no-deprecated-v-on-native-modifier -->
<!-- eslint-disable vue/no-deprecated-v-on-native-modifier -->
<!-- eslint-disable vue/no-deprecated-v-on-native-modifier -->
<!-- eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain -->
<script setup lang="ts">
// import { RouterLink, RouterView } from 'vue-router'
import { ref, watch } from 'vue'
import { ArrowUp as Arrow, Square as Pause } from '@vicons/ionicons5'
import { fetchRequest } from '@/services/sse'
import type { ChatRequest } from '@/types/message'
import { useChatInfoStore } from '@/stores/chatInfo'
import { defineStore, storeToRefs } from 'pinia'
import { switchDataToClientMsg } from '@/services/chat'

import { NIcon } from 'naive-ui'
import type { SelectGroupOption, SelectOption } from 'naive-ui'
import { useMessage } from 'naive-ui'

const message = useMessage()
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

//
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function keyUp(e: any) {
  if (e.ctrlKey && e.keyCode == 13) {
    //用户点击了ctrl+enter触发
    chatStore.inputBoxInfo += '\n'
  } else {
    //用户点击了enter触发
    sendMessage()
  }
}

const emits = defineEmits(['isSended'])

const { controller, signal } = storeToRefs(chatStore)
const sendMessage = async () => {
  try {
    signal.value = controller.value.signal //更新信号
    const inputBoxInfo = chatStore.inputBoxInfo.trim()
    chatStore.inputBoxInfo = ''

    console.log(chatStore.isSending)

    if (chatStore.isSending) {
      controller.value.abort() //中止
      controller.value = new AbortController() //重置控制器
      chatStore.isSending = false
      message.success('取消成功')
      return
    }
    if (inputBoxInfo !== '') {
      if (props.isNew) chatStore.cacheinputBoxInfo = inputBoxInfo
      chatStore.allChats?.push(switchDataToClientMsg(inputBoxInfo))

      emits('isSended', true)
      fetchRequest(
        standify(
          currentChatInfo.value?.id ? currentChatInfo.value?.id : null,
          chosenModel.value!,
          '',
          inputBoxInfo,
        ),
        signal.value,
      )
    }
  } catch (error) {
    console.error(error)
    message.error('发送错误')
  }
}
</script>

<template>
  <div class="inputBox">
    <n-input
      @keyup.enter="keyUp"
      v-model:value="chatStore.inputBoxInfo"
      id="typeIn"
      type="textarea"
      round
      clearable
      placeholder="询问任何问题，Ctrl+Enter换行，双击Enter取消"
      :autosize="{
        minRows: 1,
        maxRows: 4,
      }"
      style="min-width: 100%"
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
            <Arrow v-if="!chatStore.isSending" />
            <Pause v-else />
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
@media screen and (max-width: 768px) {
  .inputBox {
    width: 100%;
    padding-top: 0.8rem;
    padding-left: 0.8rem;
    padding-right: 0.8rem;
    padding-bottom: 0.9rem;
  }
  .n-input-wrapper {
    width: 100%;
  }
}
</style>
