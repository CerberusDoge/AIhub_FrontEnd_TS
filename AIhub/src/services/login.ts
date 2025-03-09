// import { inject, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import request from '@/utils/request';
import type { RequsetUser, ResponseLogin } from '@/types/account'
import type{ AxiosError} from 'axios'

// import type { AxiosRequestConfig } from 'axios'

const message = useMessage()
const router = useRouter()

