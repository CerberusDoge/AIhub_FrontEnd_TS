<script setup lang="ts">
import {
  Sync,
  SettingsOutline,
  Journal as Menu,
  Add,
  LogOutOutline,
  BookmarksOutline as Mark,
  ChatbubblesOutline as Chat,
} from '@vicons/ionicons5'
import { NIcon } from 'naive-ui'
import RecentFolder from '@/components/Sider/RecentFolder.vue'
import FavoriteFolder from './FavoriteFolder.vue'
import { useMessage } from 'naive-ui'
import { useMenuStore } from '@/stores/menuInfo'
import { useRouter } from 'vue-router'
const menuInfo = useMenuStore()
import { getUserInfo } from '@/services/user'
import { throttle } from '@/utils/debounce'

const changeMenu = () => {
  menuInfo.isDisplay = !menuInfo.isDisplay
  console.log(menuInfo.isDisplay)
}
const message = useMessage()
const logOut = () => {
  localStorage.clear()
  router.push('/login')
}
const setUp = () => {
  router.replace('/chat/setting')
}

const async = throttle(() => {
  getUserInfo().then(() => message.success('刷新成功'))
}, 500)

const router = useRouter()
</script>

<template>
  <!-- <n-switch v-model:value="collapsed" /> -->
  <div class="wrap">
    <div class="top">
      <div class="topTitle">
        <div>AIhub</div>
        <n-button quaternary circle type="primary" color="#767676" @click="changeMenu">
          <template #icon>
            <n-icon size="1.5rem"><Menu /></n-icon>
          </template>
        </n-button>
      </div>

      <div id="newButton" @click="router.push('/chat')">
        <n-icon size="1.4rem"><Add /></n-icon>
        <div class="rowTitle">新对话</div>
      </div>
    </div>
    <div class="scrollArea">
      <div class="row">
        <n-collapse :default-expanded-names="['1']">
          <template #header-extra>
            <n-icon><Chat /></n-icon>
          </template>
          <n-collapse-item title="最近对话" name="1">
            <RecentFolder></RecentFolder>
          </n-collapse-item>
        </n-collapse>
      </div>
      <div class="row">
        <n-collapse :default-expanded-names="['1']">
          <template #header-extra>
            <n-icon><Mark /></n-icon>
          </template>
          <n-collapse-item title="收藏夹" name="1">
            <FavoriteFolder></FavoriteFolder>
          </n-collapse-item>
        </n-collapse>
      </div>
      <div class="bottom">
        <div class="row" @click="async">
          <n-icon size="1.4rem"><Sync /></n-icon>
          <div class="rowTitle">刷新</div>
        </div>
        <div class="row" @click="setUp">
          <n-icon size="1.4rem"><SettingsOutline /></n-icon>
          <div class="rowTitle">设置</div>
        </div>
        <div class="row" @click="logOut">
          <n-icon size="1.4rem"><LogOutOutline /></n-icon>
          <div class="rowTitle">注销</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.wrap {
  padding: 0.4rem 1rem 1rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  max-height: 100%;
  width: 100%;
}
.top {
  display: flex;
  width: 100%;
  flex-direction: column;
  padding-bottom: 0.5rem;
  .topTitle {
    font-size: 1.1rem;
    font-weight: bold;
    margin: 0.1rem 0;
    display: flex;
    justify-content: space-between;
    padding: 0.4rem;
    align-items: center;
  }
}
.scrollArea {
  max-height: 100%;
  flex: 1;
  overflow: auto;
}
.scrollArea::-webkit-scrollbar {
  display: none;
}
.row {
  margin-bottom: 0.6rem;
  width: 15rem;
  padding: 0.5rem;
  max-width: 100%;
  background-color: vars.$grey;
  border-radius: 0.7rem;
  display: flex;
  align-items: center;
  transition: border 0.3s ease;
  .rowTitle {
    margin-left: 0.5rem;
  }
}
.row:hover {
  background-color: vars.$deepGrey;
}

#newButton {
  font-weight: bold;
  color: #4da214;
  margin-bottom: 0.6rem;
  width: 15rem;
  padding: 0.5rem;
  max-width: 100%;
  background-color: vars.$dimGreen;
  border-radius: 0.7rem;
  display: flex;
  align-items: center;
  transition: border 0.3s ease;
  border: 0.1rem solid #5fbd22;
  .rowTitle {
    margin-left: 0.5rem;
  }
}
</style>
