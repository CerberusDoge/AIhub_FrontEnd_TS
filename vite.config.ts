import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

import { visualizer } from 'rollup-plugin-visualizer'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import { manualChunksPlugin } from 'vite-plugin-webpackchunkname'

import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    vue(),
    vueDevTools(),
    manualChunksPlugin(),
    visualizer(),
    Components({
      resolvers: [NaiveUiResolver()],
    }),
    AutoImport({
      imports: [
        'vue',
        {
          'naive-ui': ['useMessage'],
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/variables.scss" as vars;`,
      },
    },
  },
  build: {
    cssCodeSplit: true, // 启用 CSS 代码拆分
    sourcemap: false, //找到原始错误
    manifest: false, //不生成manifest
    minify: 'terser', // 必须开启：使用terserOptions才有效果
    terserOptions: {
      compress: {
        //生产环境时移除console
        pure_funcs: ['console.log'], // 只删除 console.log
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        chunkFileNames: 'js/[name]-[hash].js', // 引入文件名的名称
        entryFileNames: 'js/[name]-[hash].js', // 包的入口文件名称
        assetFileNames: '[ext]/[name]-[hash].[ext]', // 资源文件像 字体，图片等
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // 让每个插件都打包成独立的文件
            if (id.includes('vue')) return 'vue'
            return id.toString().split('node_modules/')[1].split('/')[0].toString()
          }
        },
      },
    },
  },
})
