import { defineStore } from 'pinia'
import { ref } from 'vue'

// 尽量少存储 在植物列表页面跳转到植物信息页面时 如果Store为空则将植物列表信息存入pinia中
// 之后植物信息页面就可以读取pinia中的数据而不是页面之间的传值 效率提升很多
// 如果有之前的植物列表数据则先清除 pinia中的数据 再写入当前植物的植物列表信息
// 始终保持pinia中只存储一个植物的植物列表信息 利用pinia作为数据缓存

// 定义 Store
export const usePlantStore = defineStore(
  'plant', () => {
    // 植物列表信息 包括 植物id 植物中英文名 植物位置 植物图片
    const plant = ref()

    // 保存植物列表信息，跳转到植物详情页面时使用
    const setPlant = (val) => {
      plant.value = val
    }

    // 清理植物列表信息，跳转到植物详情页面时使用
    const clearPlant = () => {
      plant.value = null
    }

    // 记得 return
    return {
      plant,
      setPlant,
      clearPlant,
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