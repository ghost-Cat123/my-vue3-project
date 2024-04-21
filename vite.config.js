import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import path from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      // 配置src别名
      '@': path.resolve(__dirname, './src/')
    }
  },
  plugins: [
    uni(),
  ],
})
