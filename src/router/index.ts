import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  // history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: '/chat' },
    {
      path: '/chat',
      name: 'chat',
      component: () => import(/* webpackChunkName: "chat" */ '@/views/HomeView.vue'),
      meta: { requiresAuth: true }, // 添加元信息，表示该路由需要登录才能访问
      children: [
        {
          path: '',
          name: 'firstChatPage',
          component: () => import(/* webpackChunkName: "chat" */ '@/views/chat/FirstChatView.vue'),
        },
        {
          path: 'roleCenter',
          name: 'roleCenter',
          component: () => import(/* webpackChunkName: "chat" */ '@/views/chat/ChatView.vue'),
        },
        {
          path: 'setting',
          name: 'setting',
          component: () => import(/* webpackChunkName: "chat" */ '@/views/chat/SettingView.vue'),
        },
        {
          path: ':id',
          component: () => import(/* webpackChunkName: "chat" */ '@/views/chat/ChatView.vue'),
        },
      ],
    },
    {
      path: '/about',
      name: 'about',

      component: () => import(/* webpackChunkName: "loginAndRegister" */ '@/views/AboutView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "loginAndRegister" */ '@/views/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',

      component: () =>
        import(/* webpackChunkName: "loginAndRegister" */ '@/views/RegisterView.vue'),
    },
    {
      path: '/test',
      name: 'test',

      component: () => import('@/components/STT/SSTbtn.vue'),
    },
    {
      path: '/:catchAll(.*)',
      component: () => import('@/views/404.vue'),
    },
  ],
})

router.beforeEach((to, from, next) => {
  const logg = localStorage.getItem('isLoggedIn')
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // 检查是否已登录，这里假设使用 localStorage 存储登录状态

    if (logg == 'islogged') next()
    else {
      next({ name: 'login' }) // 未登录则跳转到登录页
    }
  } else {
    if (logg == 'islogged' && (to.name === 'login' || to.name === 'register')) {
      next({ name: 'chat' })
    }
    next() // 不需要登录的路由直接放行
  }
})

export default router
