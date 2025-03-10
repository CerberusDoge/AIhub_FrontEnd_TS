<script setup lang="ts">
import {
  BookmarkOutline,
  DiceOutline,
  FolderOutline,
  SettingsOutline,
  Add,
} from '@vicons/ionicons5'
import { NIcon } from 'naive-ui'
import { defineComponent, h, ref } from 'vue'
import { RouterLink } from 'vue-router'

function renderIcon(icon: any) {
  return () => h(NIcon, null, { default: () => h(icon) })
}
BookmarkOutline
const collapsed = ref(false)
const menuOptions = [
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'firstChatPage',
            // params: {
            //   lang: 'zh-CN',
            // },
          },
        },
        { default: () => '开启新对话' },
      ),
    key: 'newChat',
    icon: renderIcon(Add),
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'roleCenter',
            // params: {
            //   lang: 'zh-CN',
            // },
          },
        },
        { default: () => '角色中心' },
      ),
    key: 'roleCenter',
    icon: renderIcon(DiceOutline),
  },
  {
    label: '收藏夹',
    key: 'collection',
    icon: renderIcon(FolderOutline),
    children: [
      {
        type: 'group',
        label: '对话',
        key: 'people',
        children: [
          {
            label: '叙事者',
            key: 'narrator',
            icon: renderIcon(FolderOutline),
          },
          {
            label: '饮品',
            key: 'beverage',
            icon: renderIcon(FolderOutline),
            children: [
              {
                label: '威士忌',
                key: 'whisky',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'setting',
          },
        },
        { default: () => '设置' },
      ),
    key: 'setting',
    icon: renderIcon(SettingsOutline),
    href: '/setting',
  },
]
</script>

<template>
  <!-- <n-switch v-model:value="collapsed" /> -->
<div></div>
</template>

<style scoped lang="scss">
.n-layout {
  width: 4%;
  padding: 0;
  margin: 0;
  border: 0;
  height: 100%;
  z-index: 1000;
  overflow: visible;
}
.n-layout-sider {
  background-color: vars.$dimGreen;
}

@media screen and (max-width: 768px) {
  .n-card {
    width: 90%;
    max-height: 100%;
  }
}
@media screen and (min-width: 769px) and (max-width: 1024px) {
  .n-card {
    width: 60%;
    max-height: 100%;
  }
}
@media screen and (min-width: 1025px) {
  .n-card {
    width: 30%;
    max-height: 100%;
  }
}
</style>
