<script setup lang="ts">
import { Pencil, Copy, Bookmarks, ShareSocial } from '@vicons/ionicons5'
import { ref,useSlots,defineProps  } from 'vue'
import { useMessage } from 'naive-ui'
import { useChatInfoStore } from '@/stores/chatInfo'

const chatStore = useChatInfoStore()
const message = useMessage()
const isHover = ref<boolean>(false)
const props=defineProps<{messages:string}>()


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
    const text = props.messages
    chatStore.inputBoxInfo = text
    console.log('修改成功')
    message.success('已复制到控制台')
  } catch(err) {
    console.error('编辑出错:', err)
    message.error('编辑出错')
  }
}
</script>

<template>



  <div class="cardContainer" @mouseover="isHover = true" @mouseleave="isHover = false">
    <div class="card" v-text="props.messages"></div>
    <div :class="{ 'ghost-mode': !isHover }" class="tool">
      <div class="normalMode">
        <div class="normalMode">
        <n-tooltip trigger="hover" placement="top">
          <template #trigger>
            <n-float-button :style="{ boxShadow: 'none' }" @click="editSlotContent" position="relative" height="30" width="30">
              <n-icon size="16px">
                <Pencil />
              </n-icon>
            </n-float-button>
          </template>
          编辑
        </n-tooltip>
        <n-tooltip trigger="hover" placement="top">
          <template #trigger>
            <n-float-button :style="{ boxShadow: 'none' }" @click="copySlotContent" position="relative" height="30" width="30">
              <n-icon size="16px">
                <Copy />
              </n-icon>
            </n-float-button>
          </template>
          复制
        </n-tooltip>
        <n-tooltip trigger="hover" placement="top">
          <template #trigger>
            <n-float-button :style="{ boxShadow: 'none' }"position="relative" height="30" width="30">
              <n-icon size="16px">
                <Bookmarks />
              </n-icon>
            </n-float-button>
          </template>
          收藏
        </n-tooltip>
        <n-tooltip trigger="hover" placement="top">
          <template #trigger>
            <n-float-button :style="{ boxShadow: 'none' }" position="relative" height="30" width="30">
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
  </div>
</template>

<style scoped lang="scss">
.cardContainer {
  display: flex;
  justify-content: center;
  align-items: end;
  max-width: 90vw;
  padding: 0.7vw;
  flex-direction: column;
}
.card {
  padding: 0.8vw;
  background-color: #f5f5f5;
  border-radius: 0.5vw;
  width: fit-content;
  max-width: 90%;
  overflow: hidden;
  flex-wrap: wrap;
  word-wrap: break-word;
  white-space: pre-wrap;
}
.ghost-mode {
  visibility: hidden; /* 隐藏但占位 */
  pointer-events: none; /* 禁用交互 */
  position: relative; /* 保持文档流定位 */
  z-index: -1; /* 防止遮挡其他元素 */
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
