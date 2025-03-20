<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script lang="ts" setup>
import { useMessage } from 'naive-ui'
import { returnRules } from '@/utils/accountRule'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { throttle } from '@/utils/debounce'
import type { FormInst } from 'naive-ui' // 引入 FormInstance 类型
import type { RequsetUser } from '@/types/account'
import { requestLogin } from '@/services/login'

const form = ref<FormInst | null>(null)
const message = useMessage()
const model = ref<RequsetUser>({
  account: null,
  password: null,
})

const cacheAccount = ref(localStorage.getItem('account'))
if (cacheAccount.value) {
  model.value.account = cacheAccount.value
}

const router = useRouter()
const rules = computed(() => returnRules(model.value.password))
const userData: any = ref(null)

const handleLoginButtonClick = throttle((e: any) => {
  e.preventDefault()
  form.value?.validate(async (errors: any) => {
    if (!errors) {
      // 这里可以添加实际的登录逻辑，例如发送请求到后端
      try {
        userData.value = await requestLogin({
          account: model.value.account,
          password: model.value.password,
        })
        message.success('登录成功')
        setTimeout(() => {
          router.push('/chat')
        }, 1000)
      } catch (errors: any) {
        console.log(errors)
        if (errors && errors.status == 400) message.error('登录失败，请检查输入信息')
        else message.error('登录失败，连接超时')
      }
    } else {
      console.log(errors)
      message.error('登录失败，请检查输入信息')
    }
  })
}, 200)
</script>
<template>
  <n-form ref="form" :model="model" :rules="rules">
    <n-form-item path="account" label="账号">
      <n-input v-model:value="model.account" @keydown.enter.prevent placeholder="请输入账号" />
    </n-form-item>
    <n-form-item path="password" label="密码">
      <n-input
        v-model:value="model.password"
        type="password"
        placeholder="请输入密码"
        @keydown.enter.prevent
      />
    </n-form-item>
    <n-flex justify="end">
      <div style="display: flex; justify-content: flex-end">
        <n-button round type="primary" @click="handleLoginButtonClick" style="margin-right: 0.7rem">
          登录
        </n-button>
        <n-button round type="default" @click="$router.push('/register')"> 注册 </n-button>
      </div>
    </n-flex>
  </n-form>
</template>
