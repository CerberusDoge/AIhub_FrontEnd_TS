<script setup lang="ts">
import { Pencil, Copy, Bookmarks, ShareSocial } from '@vicons/ionicons5'
import { computed, ref, useSlots, defineProps } from 'vue'
import { useMessage } from 'naive-ui'
import { chatInfoStore } from '@/stores/chatInfo'
import { marked } from 'marked'

const chatStore = chatInfoStore()
const slots = useSlots()
const message = useMessage()
const isHover = ref<boolean>(false)

const props = defineProps<{
  messages: string
}>()

const RenderMd = computed(() => {
  console.log(props.messages)
  return marked(props.messages)
})

const getSlotText = () => {
  let slotText = ''
  if (slots.default) {
    const slotNodes = slots.default()
    slotNodes.forEach((node) => {
      if (typeof node.children === 'string') {
        slotText += node.children
      }
    })
  }
  return slotText
}

const copySlotContent = async () => {
  try {
    await navigator.clipboard.writeText(props.messages)
    console.log('复制成功')
    message.success('复制成功')
  } catch (err) {
    console.error('复制出错:', err)
    message.error('复制出错')
  }
}

const editSlotContent = async () => {
  try {
    const text = getSlotText()
    chatStore.inputBoxInfo = text
    console.log('修改成功')
    message.success('已复制到控制台')
  } catch (err) {
    console.error('编辑出错:', err)
    message.error('编辑出错')
  }
}
</script>

<template>
  <div class="cardContainer" @mouseover="isHover = true" @mouseleave="isHover = false">
    <div class="card"><div v-html="RenderMd"></div></div>
    <div asd class="tool">
      <div class="normalMode">
        <n-tooltip trigger="hover" placement="top">
          <template #trigger>
            <n-float-button @click="editSlotContent" position="relative" height="30" width="30">
              <n-icon size="16px">
                <Pencil />
              </n-icon>
            </n-float-button>
          </template>
          编辑
        </n-tooltip>
        <n-tooltip trigger="hover" placement="top">
          <template #trigger>
            <n-float-button @click="copySlotContent" position="relative" height="30" width="30">
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
  flex-wrap: wrap;
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
.tool{
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
