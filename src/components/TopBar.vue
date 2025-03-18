<script setup lang="ts">
// import { RouterLink, RouterView } from 'vue-router'
import {
  Pencil as EditIcon,
  RemoveCircleSharp as Remove,
  ArrowDownCircleOutline as Down,
  Heart as Love,
} from '@vicons/ionicons5'
import { NIcon } from 'naive-ui'
import type { Component } from 'vue'
import { defineProps, h, ref } from 'vue'
import ChangeMenuButton from './ChangeMenuButton.vue'
import { delChat, star } from '@/services/chat'
import { useChatInfoStore } from '@/stores/chatInfo'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'

const message = useMessage()
const router = useRouter()
const ChatInfo = useChatInfoStore()
const props = defineProps<{ title: string }>()

function renderIcon(icon: Component) {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon),
    })
  }
}

const options = ref([
  {
    label: '编辑名称',
    key: 'edit',
    icon: renderIcon(EditIcon),
  },
  {
    label: '收藏对话',
    key: 'love',
    icon: renderIcon(Love),
  },
  {
    label: '删除对话',
    key: 'delete',
    icon: renderIcon(Remove),
  },
])

async function handleSelect(key: string | number) {
  try {
    switch (key) {
      case 'edit': {
        console.log(1)
        break
      }
      case 'love': {
        star(ChatInfo.currentChatInfo!.id!)
        break
      }
      case 'delete': {
        delChat(ChatInfo.currentChatInfo!.id!)
        message.success('删除成功')
        router.push('/chat')
        break
      }
    }
  } catch (error) {
    console.error(error)
    message.error("操作失败")
  }
}

// import { useMenuStore } from '@/stores/menuInfo'
// const menuInfo = useMenuStore()
// const changeMenu = () => {
//   menuInfo.isDisplay = !menuInfo.isDisplay
// }
// </script>

<template>
  <div class="main">
    <ChangeMenuButton></ChangeMenuButton>
    <n-dropdown placement="bottom-start" trigger="hover" :options="options" @select="handleSelect">
      <n-button quaternary icon-placement="right"
        ><template #icon>
          <n-icon>
            <Down />
          </n-icon>
        </template>
        {{ props.title }}</n-button
      >
    </n-dropdown>
  </div>
</template>

<style scoped>
.main {
  display: flex;
}
</style>
