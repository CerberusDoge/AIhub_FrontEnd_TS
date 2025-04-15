<script setup lang="ts">
import CollapseSider from '@/components/Sider/CollapseSider.vue'
import { useMenuStore } from '@/stores/menuInfo'
import { getUserInfo } from '@/services/user'
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { debounce } from '@/utils/debounce'
const menuInfo = useMenuStore()
getUserInfo()
const breakpoint = 768
const windowWidth = ref(window.innerWidth)
const handleResize = debounce(() => {
  windowWidth.value = window.innerWidth // 关键：更新响应式变量
}, 200)

onMounted(() => {
  window.addEventListener('resize', handleResize) // 挂载时监听
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize) // 销毁时移除监听
})

const isMobile = computed(() => windowWidth.value < breakpoint)
</script>

<template>
  <div class="main">
    <transition name="slide" mode="out-in"
      ><div class="sider" v-show="menuInfo.isDisplay">
        <CollapseSider></CollapseSider></div
    ></transition>
    <div class="rightBar"><router-view></router-view></div>

    <div
      class="overlay"
      v-if="isMobile && menuInfo.isDisplay"
      @click="menuInfo.isDisplay = false"
    ></div>
  </div>
</template>

<style scoped lang="scss">
/* 进入前：从左侧 -100% 开始 */
.slide-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}

/* 离开后：向右侧 100% 结束 */
.slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

/* 激活状态：添加过渡效果 */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s ease-in-out;
}

/* 进入完成/离开开始时的最终位置 */
.slide-enter-to,
.slide-leave-from {
  transform: translateX(0);
  opacity: 1;
}
.main {
  display: flex;
  height: 100%;
  overflow: visible;
  max-height: 100%;
  .sider {
    background-color: vars.$dimGrey;
    display: flex;
    height: 100%;
    max-height: 100%;
    // padding: 0.4rem 1rem 1rem 1rem;
    user-select: none;
  }
  .rightBar {
    display: flex;
    background-color: white;
    align-items: center;
    justify-content: center;
    flex: 6.5 1 0;
  }
}

.topBotton {
  padding: 0.8rem;
  padding-left: 2rem;
}

@media screen and (max-width: 768px) {
  .main {
    .sider {
      position: fixed;
      z-index: 1000;
    }
  }
  .slide-enter-active,
  .slide-leave-active {
    transition: all 0.2s ease-in-out;
  }
  /* 进入前：从左侧 -100% 开始 */
  .slideBg-enter-from {
    transform: translateX(-100%);
    opacity: 0;
  }

  /* 离开后：向右侧 100% 结束 */
  .slideBg-leave-to {
    transform: translateX(-100%);
    opacity: 0;
  }

  /* 激活状态：添加过渡效果 */
  .slideBg-enter-active,
  .slideBg-leave-active {
    transition: all 0.1s ease-in-out;
  }

  /* 进入完成/离开开始时的最终位置 */
  .slideBg-enter-to,
  .slideBg-leave-from {
    transform: translateX(0);
    opacity: 1;
  }
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }
}
</style>
