<script setup lang="ts">
// import { RouterLink, RouterView } from 'vue-router'
import {
  Pencil as EditIcon,
  RemoveCircleSharp as Remove,
  ArrowDownCircleOutline as Down,
  Heart as Like,
  HeartOutline as DisLike,
} from '@vicons/ionicons5'
import { NIcon } from 'naive-ui'
import type { Component } from 'vue'
import { defineProps, h, ref, watch } from 'vue'
import ChangeMenuButton from '@/components/TopBar/ChangeMenuButton.vue'
import { delChat, star, unStar } from '@/services/chat'
import { useChatInfoStore } from '@/stores/chatInfo'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import { storeToRefs } from 'pinia'

const message = useMessage()
const router = useRouter()
const ChatInfo = useChatInfoStore()
const { currentChatInfo } = storeToRefs(ChatInfo)
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
    label: currentChatInfo.value.starred ? '已收藏' : '未收藏',
    key: 'love',
    icon: renderIcon(currentChatInfo.value.starred ? Like : DisLike),
  },
  {
    label: '删除对话',
    key: 'delete',
    icon: renderIcon(Remove),
  },
])

watch(
  () => currentChatInfo.value.starred,
  (newValue) => {
    if (newValue) {
      //喜欢
      options.value[1].label = '已收藏'
      options.value[1].icon = renderIcon(Like)
    } else {
      options.value[1].label = '未收藏'
      options.value[1].icon = renderIcon(DisLike)
    }
  },
)

async function handleSelect(key: string | number) {
  try {
    switch (key) {
      case 'edit': {
        console.log(1)
        break
      }
      case 'love': {
        if (currentChatInfo.value.starred) {
          unStar(ChatInfo.currentChatInfo!.id!)
            .then(() => message.success('已取消收藏'))
            .catch((error) => {
              message.error('取消收藏失败')
            })
        } else {
          star(ChatInfo.currentChatInfo!.id!)
            .then(() => message.success('收藏成功'))
            .catch((error) => {
              message.error('收藏失败')
            })
        }
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
    message.error('操作失败')
  }
}
</script>

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
