<script lang="ts" setup>
import { useMessage } from 'naive-ui'
import { returnRules } from '@/utils/accountRule'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import request from '@/utils/request'
import { debounce } from '@/utils/debounce'
import type { FormInst } from 'naive-ui' // 引入 FormInstance 类型
import type { RequsetUser, ResponseLogin } from '@/types/account'
import { useUserStore } from '@/stores/userInfo'

const store = useUserStore()
const form = ref<FormInst | null>(null)
const message = useMessage()
const model = ref<RequsetUser>({
  account: null,
  password: null,
})

const cacheAccount = ref(localStorage.getItem('account'))
if (cacheAccount) {
  model.value.account = cacheAccount.value
}

const router = useRouter()
const rules = computed(() => returnRules(model.value.password))
const userData: any = ref(null)

//登录请求
const requestLogin = async (dataAccount: RequsetUser): Promise<ResponseLogin> => {
  try {
    const result = await request<ResponseLogin>({
      url: '/api/v1/login',
      method: 'post',
      data: dataAccount,
    })
    // console.log('登录信息:', result)
    message.success('登录成功')
    localStorage.setItem('accessToken', result.accessToken)
    localStorage.setItem('refreshToken', result.refreshToken)
    localStorage.setItem('id', JSON.stringify(result.id))
    localStorage.setItem('account', result.account)
    localStorage.setItem('isLoggedIn', "islogged")
    store.account = result.account
    store.accessToken = result.accessToken
    store.refreshToken = result.refreshToken

    setTimeout(() => {
      router.push('/chat')
    }, 1000)

    return result.data
  } catch (error: any) {
    console.error(error)
    if (error.response.status == 400) message.error('登录失败，密码错误')
    else message.error('登录失败，连接超时')
    throw error // 重新抛出错误以保持 Promise 链
  }
}

const handleLoginButtonClick = debounce((e: any) => {
  e.preventDefault()
  form.value?.validate((errors: any) => {
    if (!errors) {
      // 这里可以添加实际的登录逻辑，例如发送请求到后端
      userData.value = requestLogin({
        account: model.value.account,
        password: model.value.password,
      })
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
