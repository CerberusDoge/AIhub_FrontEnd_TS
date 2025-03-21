<script setup lang="ts">
// import { RouterLink, RouterView } from 'vue-router'
import { Key } from '@vicons/ionicons5'
import ChangeMenuButton from '@/components/TopBar/ChangeMenuButton.vue'
import { ref } from 'vue'
import { updateUserInfo } from '@/services/user'
import { debounce } from '@/utils/debounce'
import { useMessage } from 'naive-ui'
import type { UpdateRequest } from '@/types/account'
const message = useMessage()
enum Model {
  DeepseekR1 = 'deepseek-r1',
  Doubao15Pro = 'doubao-1.5pro',
}

const modelValue = ref<UpdateRequest>({
  apiKey: localStorage.getItem('apiKey') ? localStorage.getItem('apiKey') : '',
  // password: 'GOGOgasd!123123',
})
console.log(modelValue.value.apiKey)
const selectOptions = ref([
  {
    label: 'deepseek-r1',
    value: Model.DeepseekR1,
  },
  {
    label: 'doubao-1.5pro',
    value: Model.Doubao15Pro,
  },
])
const submitModel = debounce(() => {
  console.log(modelValue.value)
  updateUserInfo(modelValue.value)
    .then(() => {
      message.success('上传成功')
      if (modelValue.value.apiKey) localStorage.setItem('apiKey', modelValue.value.apiKey)
    })
    .catch((error) => {
      console.error(error)
      message.error('上传失败')
    })
}, 500)
</script>

<template>
  <div class="layout">
    <div class="topBar">
      <ChangeMenuButton />
      <div class="topTitle">设置中心</div>
    </div>
    <div class="main">
      <n-collapse default-expanded-names="1">
        <n-collapse-item title="API设置" name="1">
          <div>
            <n-input-group>
              <n-select
                :style="{ width: '33%' }"
                :options="selectOptions"
                size="large"
                placeholder="选择模型"
              />
              <n-input
                v-model:value="modelValue.apiKey"
                type="text"
                size="large"
                placeholder="输入key"
              >
                <template #prefix>
                  <n-icon :component="Key" />
                </template>
              </n-input>
              <n-button @click="submitModel" color="#5FBD22" type="primary" size="large">
                确认
              </n-button>
            </n-input-group>
          </div>
        </n-collapse-item>
        <n-collapse-item title="密码设置" name="2">
          <div style="margin-bottom: 0.6rem">
            <n-input
              type="password"
              show-password-on="mousedown"
              placeholder="输入原密码"
              :maxlength="8"
            />
          </div>
          <div>
            <n-input
              type="password"
              show-password-on="mousedown"
              placeholder="输入新密码"
              :maxlength="8"
            />
          </div>
        </n-collapse-item>
      </n-collapse>
    </div>
  </div>
</template>

<style scoped lang="scss">
.layout {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
}
.topBar {
  padding: 1rem;
  display: flex;
  align-items: center;
  .topTitle {
    font-size: 1.4rem;
    font-weight: bold;
  }
}
.main {
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

@media screen and (max-width: 768px) {
}
</style>
