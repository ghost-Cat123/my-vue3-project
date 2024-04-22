import { defineStore } from 'pinia'
import { ref } from 'vue'

// 定义 Store
export const usePostStore = defineStore(
  'post', () => {
    // 用户发帖信息 包括 植物id 植物中英文名 植物位置 植物图片
    const post = ref()

    // 保存植物列表信息，跳转到植物详情页面时使用
    const setPost = (val) => {
      post.value = val
    }

    // 清理植物列表信息，跳转到植物详情页面时使用
    const clearPost = () => {
      post.value = null
    }

    // 记得 return
    return {
      post,
      setPost,
      clearPost,
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