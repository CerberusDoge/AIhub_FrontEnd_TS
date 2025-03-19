<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { useMessage, type FormInst } from 'naive-ui'
import { ref, computed } from 'vue'
import { returnRules } from '@/utils/accountRule'
import request from '@/utils/request'
import { useRouter } from 'vue-router'
import type { RequsetUser } from '@/types/account'
import { debounce } from '@/utils/debounce'

const form = ref<null | FormInst>(null)
const message = useMessage()
const model = ref({
  account: null,
  password: null,
  reenteredPassword: null,
})
const router = useRouter()

const rules = computed(() => returnRules(model.value.password))

const requestRegister = async (dataAccount: RequsetUser) => {
  try {
    await request<string>({
      url: '/api/v1/register',
      method: 'post',
      data: dataAccount,
    })

    message.success('注册成功')

    setTimeout(() => {
      router.push('/login')
    }, 1000)
  } catch (error: any) {
    console.error(error)
    if (error.response.status == 400) message.error('注册失败，用户名已注册')
    else message.error('注册失败，连接超时')
  }
}

const handleRegisterButtonClick = debounce((e: any) => {
  e.preventDefault()
  form.value?.validate((errors) => {
    if (!errors) {
      const data = { account: model.value.account, password: model.value.password }
      requestRegister(data)
      // 这里可以添加实际的登录逻辑，例如发送请求到后端
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
      <n-flex vertical>
        <div class="prompt">账号必须为11位数字</div>
        <n-input v-model:value="model.account" @keydown.enter.prevent placeholder="请输入账号"
      /></n-flex>
    </n-form-item>
    <n-form-item path="password" label="密码">
      <n-flex vertical>
        <div class="prompt">需包含大小写字母、数字、特殊符号，且长度 8-20 位</div>
        <n-input
          v-model:value="model.password"
          type="password"
          placeholder="请输入密码"
          @keydown.enter.prevent
        />
      </n-flex>
    </n-form-item>

    <n-form-item ref="rPasswordFormItemRef" first path="reenteredPassword" label="重复密码">
      <n-input
        v-model:value="model.reenteredPassword"
        :disabled="!model.password"
        type="password"
        @keydown.enter.prevent
        placeholder="请再次输入密码"
      />
    </n-form-item>
    <n-flex justify="end">
      <div style="display: flex; justify-content: flex-end">
        <n-button round type="primary" @click="handleRegisterButtonClick"> 注册 </n-button>
      </div>
    </n-flex>
  </n-form>
</template>

<style scoped lang="scss">
.prompt {
  color: vars.$dimDark;
  font-size: vars.$font-size-small;
  height: fit-content;
}
.n-flex {
  flex: 1;
}
</style>
