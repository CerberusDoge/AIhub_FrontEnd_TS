<script setup lang="ts">
// import { RouterLink, RouterView } from 'vue-router'
import { ref } from 'vue'
import { ArrowUp as Arrow } from '@vicons/ionicons5'

const loadingRef = ref(false)
const handleClick = () => {
  loadingRef.value = true
  setTimeout(() => {
    loadingRef.value = false
  }, 2000)
}
const input = ref('')
</script>

<template>
  <div class="inputBox">
    <n-input
      show-count
      id="typeIn"
      v-model="input"
      type="textarea"
      round
      clearable
      placeholder="请输入内容"
      :autosize="{
        minRows: 2,
        maxRows: 7,
      }"
    />
    <div class="bottomContent">
      <n-button circle :loading="loadingRef" @click="handleClick" color="#5FBD22">
        <template #icon>
          <n-icon>
            <Arrow />
          </n-icon>
        </template>
      </n-button>
    </div>

    <!-- <input type="text"  v-model="input" placeholder="询问任何问题" /> -->
  </div>
</template>

<style scoped lang="scss">

::v-deep(.n-input__border) {
  display: none; /* 直接隐藏边框层 */
}

/* 深度选择器应对scoped样式 */
:deep(.n-input) {
  --n-border-focus: transparent !important;
  --n-box-shadow-focus: none !important;
}

.inputBox {
  font-size: 1rem;
  line-height: 1.5rem;
  border: 0 solid #e3e3e3;
  box-sizing: border-box;
  max-height: 20rem;
  display: flex;
  width: 80%;
  cursor: text;
  flex-direction: column;
  border-radius: 1.5rem;
  border-width: 1px;
  border-color: vars.$border-light;
  box-shadow: vars.$box-shadow;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  padding-bottom: 0.7rem;
  padding-top: 0.9rem;
}

#typeIn {
  width: 70vw;
  font-family: vars.$font-family;
  font-size: vars.$font-size-normal;
  border: none;
  color: black;
  resize: none;
  outline: none;
  margin-bottom: 10px;
}
.bottomContent {
  display: flex;
  justify-content: end;
}
</style>
