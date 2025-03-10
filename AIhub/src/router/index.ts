import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/chat' },
    {
      path: '/chat',
      name: 'chat',
      component: () => import('@/views/HomeView.vue'),
      meta: { requiresAuth: true }, // 添加元信息，表示该路由需要登录才能访问
      children: [
        {
          path: 'roleCenter',
          name: 'roleCenter',
          component: () => import('@/views/chat/ChatView.vue'),
        },
        {
          path: 'setting',
          name: 'setting',
          component: () => import('@/views/chat/SettingView.vue'),
        },
        {
          path: '/chat',
          name: 'firstChatPage',
          component: () => import('@/views/chat/FirstChatView.vue'),
        },
      ],
    },
    {
      path: '/about',
      name: 'about',

      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',

      component: RegisterView,
    },
  ],
})

router.beforeEach((to, from, next) => {

  const logg = localStorage.getItem('isLoggedIn')
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // 检查是否已登录，这里假设使用 localStorage 存储登录状态

    if(logg == 'islogged')
      next()
      else {
      next({ name: 'login' }) // 未登录则跳转到登录页
    }
  } else {
    if (logg == 'islogged'&&(to.name === 'login' || to.name === 'register')) {
      next({ name: 'chat' })
    }
    next() // 不需要登录的路由直接放行
  }
})

export default router
