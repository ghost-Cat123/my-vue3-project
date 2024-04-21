import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTokenStore = defineStore(
  'token', () => {
    // token信息 响应式变量
    const token = ref('')

    // 更新token信息
    const setToken = (newToken) => {
      token.value = newToken
    }

    // 清除token信息
    const cleanToken = () => {
      token.value = ''
    }

    // 返回pinia方法
    return {
      token,
      setToken,
      cleanToken
    }
  },
  {
    // 网页端配置
    // persist: true,
    // 小程序端配置
    persist: {
      storage: {
        getItem(key) {
          return uni.getStorageSync(key)
        },
        setItem(key, value) {
          uni.setStorageSync(key, value)
        },
      },
    },
  },
)