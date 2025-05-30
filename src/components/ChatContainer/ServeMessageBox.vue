<!-- eslint-disable vue/no-parsing-error -->
<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { Copy, Bookmarks, ShareSocial } from '@vicons/ionicons5'
import { computed, ref, defineProps, watch, onUnmounted, onMounted } from 'vue'
import { useMessage } from 'naive-ui'
import { parseMarkdown } from '@/utils/marked'

const props = defineProps<{
  messages: string
  isNew: boolean
}>()
const message = useMessage()
const currentIndex = ref(0) //当前读取的位置
const isHover = ref<boolean>(false)
const msg = ref('') //存储当前已经打印的消息
const isNew = props.isNew //存储是否完成打印
let timer: any = null

//打印效果
const typing = async () => {
  //存在未打印的
  if (currentIndex.value < props.messages.length) {
    msg.value += props.messages.charAt(currentIndex.value++)
    timer = await setTimeout(typing, 40)
  } else {
    clearTimeout(timer)
  }
}
if (isNew) typing()
else msg.value = props.messages

onUnmounted(() => clearTimeout(timer))
watch(
  () => props.messages,
  () => {
    if (isNew) typing()
    else msg.value = props.messages
  },
)

const RenderMd = computed(() => {
  if (!isNew) return parseMarkdown(props.messages)
  else return parseMarkdown(msg.value)
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

// 添加复制代码的功能
const copyCode = (button: HTMLElement) => {
  const codeBlock = button.closest('.code-block')
  const code = codeBlock?.querySelector('code')?.textContent || ''

  navigator.clipboard
    .writeText(code)
    .then(() => {
      const copyText = button.querySelector('.copy-text') as HTMLElement
      const copySuccess = button.querySelector('.copy-success') as HTMLElement

      if (copyText && copySuccess) {
        copyText.style.display = 'none'
        copySuccess.style.display = 'inline'

        setTimeout(() => {
          copyText.style.display = 'inline'
          copySuccess.style.display = 'none'
        }, 2000)
      }
    })
    .catch((err) => {
      console.error('复制代码失败:', err)
      message.error('复制代码失败')
    })
}

// 将copyCode函数添加到window对象
onMounted(() => {
  ;(window as any).copyCode = copyCode
})

onUnmounted(() => {
  delete (window as any).copyCode
})
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
            <n-float-button
              :style="{ boxShadow: 'none' }"
              @click="copyContent"
              position="relative"
              height="30"
              width="30"
            >
              <n-icon size="16px">
                <Copy />
              </n-icon>
            </n-float-button>
          </template>
          复制
        </n-tooltip>
        <n-tooltip trigger="hover" placement="top">
          <template #trigger>
            <n-float-button
              :style="{ boxShadow: 'none' }"
              position="relative"
              height="30"
              width="30"
            >
              <n-icon size="16px">
                <Bookmarks />
              </n-icon>
            </n-float-button>
          </template>
          收藏
        </n-tooltip>
        <n-tooltip trigger="hover" placement="top">
          <template #trigger>
            <n-float-button
              :style="{ boxShadow: 'none' }"
              position="relative"
              height="30"
              width="30"
            >
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
  padding: 0.7em;
  padding-top: 0;
  padding-left: 0;
  flex-direction: column;
}
.cardContent {
  max-width: 100%;
  min-width: 100%;
}
.card {
  width: 100%;
  display: flex;
  justify-content: start;
  padding: 0.6em;
  padding-bottom: 0;
  padding-top: 0;
  // background-color: #f5f5f5;
  border-radius: 0.5em;
  max-width: 100%;
  overflow: hidden;
  flex-wrap: nowrap;
  word-wrap: break-word;
  white-space: normal;
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
