<template>
  <div>
    <n-button circle @click="changeState">
      <template #icon>
        <n-icon>
          <Mic v-if="!isSST" />
          <Pause v-else />
        </n-icon>
      </template>
    </n-button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { NIcon } from 'naive-ui'
import IatRecorder from '@/utils/STT/xfVoiceDictation.js'
import { Mic, Stop as Pause } from '@vicons/ionicons5'
import { useChatInfoStore } from '@/stores/chatInfo'
import { storeToRefs } from 'pinia'
import { throttle } from '@/utils/debounce'

const ChatInfoStore = useChatInfoStore()
const { isSST, inputBoxInfo } = storeToRefs(ChatInfoStore)

const content = ref('')
let times = null

// 实例化迅飞语音听写（流式版）WebAPI
const xfVoice = new IatRecorder({
  // 服务接口认证信息
  APPID: 'b8940ead',
  APISecret: 'NTg5MGM4MzY2NjFkMTIzYmNiNTJkNjVl',
  APIKey: 'e00868a7f6f191cf35a578b55864f4e3',

  onWillStatusChange: function (oldStatus, newStatus) {
    // 可以在这里进行页面中一些交互逻辑处理：注：倒计时（语音听写只有60s）,录音的动画，按钮交互等！
  },
  onTextChange: function (text) {
    // 监听识别结果的变化
    inputBoxInfo.value = text
    // 5秒钟内没有说话，就自动关闭

    clearTimeout(times)
    times = setTimeout(() => {
      this.stop() // xfVoice.stop();
      console.log('closeSS')
    }, 5000)
  },
})
const changeState = throttle(() => {
  switch (isSST.value) {
    case false:
      console.log('start')
      isSST.value = true
      break
    case true:
      isSST.value = false
      break
  }
}, 2000)
watch(
  () => isSST.value,
  () => {
    switch (isSST.value) {
      case false:
        xfVoice.stop()
        break
      case true:
        xfVoice.start()
        break
    }
  },
)
</script>

<style scoped></style>
