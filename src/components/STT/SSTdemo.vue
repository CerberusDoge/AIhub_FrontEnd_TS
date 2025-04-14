<template>
  <div>
    <h1 class="h1">迅飞语音听写（流式版）WebAPI</h1>
    <hr />
    <section class="voice-box">
      <input type="search" name="voice" id="voice-txt" v-model="content" />
      <button ref="btn" @click="changeState">开始识别</button>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import IatRecorder from '@/utils/STT/xf-voice-dictation.js'

const content = ref('')
const state = ref('END') //START||END
let times = null

// 实例化迅飞语音听写（流式版）WebAPI
const xfVoice = new IatRecorder({
  // 服务接口认证信息 注：APISecret 和 APIKey 的长度都差不多，请要填错哦，！
  APPID: 'b8940ead',
  APISecret: 'NTg5MGM4MzY2NjFkMTIzYmNiNTJkNjVl',
  APIKey: 'e00868a7f6f191cf35a578b55864f4e3',

  onWillStatusChange: function (oldStatus, newStatus) {
    // 可以在这里进行页面中一些交互逻辑处理：注：倒计时（语音听写只有60s）,录音的动画，按钮交互等！
  },
  onTextChange: function (text) {
    // 监听识别结果的变化
    content.value = text
    console.log(text, typeof text)

    // 5秒钟内没有说话，就自动关闭

    clearTimeout(times)
    times = setTimeout(() => {
      this.stop() // xfVoice.stop();
      console.log('closeSS')
    }, 5000)
  },
})
const changeState = () => {
  switch (state.value) {
    case 'END':
      console.log('sss')
      xfVoice.start()
      state.value = 'START'
      break
    case 'START':
      console.log('STOP')
      xfVoice.stop()
      state.value = 'END'
      break
  }
}
</script>

<style scoped>
/* 在这里添加样式 */
</style>
