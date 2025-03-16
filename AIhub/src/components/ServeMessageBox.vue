<script setup lang="ts">
import { Pencil, Copy, Bookmarks, ShareSocial } from '@vicons/ionicons5'
import { computed, ref, useSlots, defineProps, watch, onUnmounted } from 'vue'
import { useMessage } from 'naive-ui'
import { useChatInfoStore } from '@/stores/chatInfo'
import { marked } from 'marked'

const props = defineProps<{
  messages: string
}>()
const message = useMessage()
const currentIndex = ref(0) //当前读取的位置
const isHover = ref<boolean>(false)
const msg = ref('') //存储当前已经打印的消息
const isOver = ref(false) //存储是否完成打印
let timer: any = null

//打印效果
const typing = () => {
  //存在未打印的
  if (currentIndex.value < props.messages.length) {
    msg.value += props.messages.charAt(currentIndex.value++)
    timer = setTimeout(typing, 50)
  } else {
    clearTimeout(timer)
  }
}

onUnmounted(() => clearTimeout(timer))
watch(
  () => props.messages,
  () => {
    if (isOver) typing()
    else msg.value = props.messages
  },
)

const RenderMd = computed(() => {
  console.log(msg.value)
  let value
  if (isOver) value = marked(msg.value)
  else value = marked(msg.value)
  console.log(value)
  return value
})

const copyContent = async () => {
  try {
    await navigator.clipboard.writeText(props.messages)
    console.log('复制成功')
    message.success('复制成功')
  } catch (err) {
    console.error('复制出错:', err)
    message.error('复制出错')
  }
}
</script>

<template>
  <div class="cardContainer" @mouseover="isHover = true" @mouseleave="isHover = false">
    <div class="card">
      <div class="cardContent" v-html="RenderMd"></div>
    </div>
    <div asd class="tool">
      <div class="normalMode">
        <n-tooltip trigger="hover" placement="top">
          <template #trigger>
            <n-float-button @click="copyContent" position="relative" height="30" width="30">
              <n-icon size="16px">
                <Pencil />
              </n-icon>
            </n-float-button>
          </template>
          编辑
        </n-tooltip>
        <n-tooltip trigger="hover" placement="top">
          <template #trigger>
            <n-float-button @click="copyContent" position="relative" height="30" width="30">
              <n-icon size="16px">
                <Copy />
              </n-icon>
            </n-float-button>
          </template>
          复制
        </n-tooltip>
        <n-tooltip trigger="hover" placement="top">
          <template #trigger>
            <n-float-button position="relative" height="30" width="30">
              <n-icon size="16px">
                <Bookmarks />
              </n-icon>
            </n-float-button>
          </template>
          收藏
        </n-tooltip>
        <n-tooltip trigger="hover" placement="top">
          <template #trigger>
            <n-float-button position="relative" height="30" width="30">
              <n-icon size="16px">
                <ShareSocial />
              </n-icon>
            </n-float-button>
          </template>
          分享
        </n-tooltip>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.cardContainer {
  display: flex;
  justify-content: center;
  align-items: start;
  width: 100%;
  padding: 0.7vw;
  flex-direction: column;
}
.card {
  width: 100%;
  padding: 0.6vw;
  padding-bottom: 0;
  // background-color: #f5f5f5;
  border-radius: 0.5vw;
  width: fit-content;
  max-width: 100%;
  overflow: hidden;
  flex-wrap: nowrap;
  word-wrap: break-word;
  white-space: pre-wrap;


}

.ghost-mode {
  width: 100%;
  visibility: hidden; /* 隐藏但占位 */
  pointer-events: none; /* 禁用交互 */
  position: relative; /* 保持文档流定位 */
  z-index: -1; /* 防止遮挡其他元素 */
}
.tool {
  width: 100%;
  display: flex;
}
.normalMode {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin-top: 0.4vw;
  .n-float-button {
    margin: 0.2vw;
    height: 8px;
    width: 8px;
  }
}
</style>
