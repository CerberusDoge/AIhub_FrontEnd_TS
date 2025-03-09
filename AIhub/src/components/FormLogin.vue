<script lang="ts" setup >
import { useMessage } from 'naive-ui'
import { returnRules } from '@/utils/accountRule'
import { ref,computed } from 'vue'
// import { requestLogin } from "@/services/login"
// import { inject, ref } from 'vue'
import { useRouter } from 'vue-router'
import request from '@/utils/request';
import type { RequsetUser, ResponseLogin } from '@/types/account'
import type{ AxiosError} from 'axios'

const form = ref(null)
const message = useMessage()
const model = ref({
  username: null,
  password: null,
})
const router = useRouter()
const rules = computed(() => returnRules(model.value.password))
const userData=ref(null)


const requestLogin = (dataAccount: RequsetUser): ResponseLogin => {
  request<ResponseLogin>({
    url: '/api/v1/login',
    method: 'post',
    data: dataAccount,
  })
    .then((result) => {
      console.log('登录信息:', result)
      router.push('/chat')
      message.success('登录成功')
      return result
    })
    .catch((error:AxiosError) => {
      console.error(error)
      message.error('登录失败，连接超时')
    })
}

const handleLoginButtonClick = (e) => {
  e.preventDefault()
  form.value?.validate((errors) => {
    if (!errors) {
      // 这里可以添加实际的登录逻辑，例如发送请求到后端
      userData.value= requestLogin({account: model.value.username,
        password: model.value.password})
        console.log()
    } else {
      console.log(errors)
      message.error('登录失败，请检查输入信息')
    }
  })
}
</script>
<template>
  <n-form ref="form" :model="model" :rules="rules">
    <n-form-item path="username" label="账号">
      <n-input v-model:value="model.username" @keydown.enter.prevent placeholder="请输入账号" />
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
