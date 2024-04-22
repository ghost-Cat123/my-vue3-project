<template>
  <view class="addPlant">
    <view class="tittle">请输入动物相关信息</view>
    <view class="form" :modelValue="petInfo">
      <uni-forms-item name="petImg" class="items" label="宠物图片">
        <uni-file-picker limit="1" :del-icon="false" disable-preview :imageStyles="imageStyles" file-mediatype="image"
          v-model="petImg" file-extname="png,jpg" ref="files" :auto-upload="false"
          @select="selectFile">选择</uni-file-picker>
      </uni-forms-item>

      <uni-forms>
        <uni-forms-item name="petCname" class="items" label="中文名称">
          <uni-easyinput v-model="petInfo.petCname" placeholder="请输入宠物中文名称" />
        </uni-forms-item>

        <uni-forms-item name="petEname" class="items" label="英文名称">
          <uni-easyinput v-model="petInfo.petEname" placeholder="请输入宠物英文名称" />
        </uni-forms-item>

        <uni-forms-item name="petAge" class="items" label="宠物年龄">
          <uni-number-box v-model="petInfo.petAge" />
        </uni-forms-item>

        <uni-forms-item name="petType" class="items" label="宠物种类">
          <uni-data-select v-model="petInfo.petType" :localdata="options" :clear="false"></uni-data-select>
        </uni-forms-item>

        <uni-forms-item name="petIntro" class="items" label="宠物简介">
          <uni-easyinput type="textarea" v-model="petInfo.petIntro" placeholder="请输入宠物介绍"></uni-easyinput>
        </uni-forms-item>

      </uni-forms>
      <button type="primary" class="btn" @click="updatePet()">更新宠物</button>
    </view>
  </view>
</template>

<script>
import { postPetInfoUpdateAPI, getPetInfoAPI } from '@/services/pet.js'
import { useTokenStore } from '@/stores/modules/token.js'
import { usePetStore } from '@/stores/modules/pet.js'


export default {
  // 数据
  data() {
    return {
      // 表单数据
      options: [
        { value: "", text: "请选择类型", disable: true },
        { value: "爬行类", text: "爬行类" },
        { value: "猫类", text: "猫类" },
        { value: "犬类", text: "犬类" },
        { value: "鱼类", text: "鱼类" },
        { value: "啮齿类", text: "啮齿类" }
      ],
      imageStyles: {
        width: 90,
        height: 90,
        border: {
          radius: '10%'
        },
      },

      // 表单绑定数据
      petInfo: {
        petId: 0,
        petCname: '',
        petEname: '',
        petImg: '',
        petType: '',
        createTime: '',
        petIntro: '',
        petAge: ''
      },

      // 向后端传递数据
      virtueUrl: {
        file: ''
      },
      petImg: {
        fileId: 0,
        url: ''
      },
      id: {
        petId: 0
      }
    }
  },

  // 方法
  methods: {
    // 获取虚拟地址
    selectFile(e) {
      this.virtueUrl.file = e.tempFiles[0].file.path
    },

    // 更新宠物信息
    async updatePet() {
      const tokenStore = useTokenStore()
      const token = tokenStore.token
      // 先上传阿里云服务器， 获取图片地址
      if (this.virtueUrl.file !== '') {
        uni.uploadFile({
          url: 'http://localhost:8080/comment/upload',
          filePath: this.virtueUrl.file,
          name: 'file',
          header: {
            'source-client': 'miniapp',
            'Authorization': token,
            "Content-Type": "multipart/form-data"
          },
          success: async (res) => {
            // 将返回的字符串转化为JSON
            // 过滤特殊符号
            let data = JSON.parse(res.data.replace('\uFEFF', ''))
            if (data.code === 1) {
              this.petInfo.petImg = data.data
              const updateRes = await postPetInfoUpdateAPI(this.petInfo)
              if (updateRes.code === 1) {
                // 成功提示
                uni.showToast({ icon: 'success', title: '更新成功' })
                setTimeout(() => {
                  // 页面跳转
                  uni.switchTab({ url: '/pages/pet/pet' })
                }, 500)
              } else {
                uni.showToast({ icon: 'none', title: updateRes.message })
              }
            } else {
              uni.showToast({ icon: 'fail', tittle: '图片上传失败' })
            }
          }
        })
      } else {
        const updateRes = await postPetInfoUpdateAPI(this.petInfo)
        if (updateRes.code === 1) {
          // 成功提示
          uni.showToast({ icon: 'success', title: '更新成功' })
          setTimeout(() => {
            // 页面跳转
            uni.switchTab({ url: '/pages/pet/pet' })
          }, 500)
        } else {
          uni.showToast({ icon: 'none', title: updateRes.message })
        }
      }
    },

    async showPetDetail() {
      // 结构data
      const res = await getPetInfoAPI(this.id)
      this.petInfo.petAge = res.data.petAge
      this.petInfo.petIntro = res.data.petIntro
    }
  },

  // 生命周期钩子函数
  onShow() {
    // 接收pinia中的数据 优化为发一次请求
    const petInfo = usePetStore()
    this.id.petId = petInfo.pet.petId
    this.petInfo = petInfo.pet
    this.petImg.url = petInfo.pet.petImg

    // 发请求获取植物年龄和植物简介
    this.showPetDetail()
  }
}

/**
 * 数据
 * 方法
 * 计算属性
 * 监听器
 * 过滤器
 * 钩子
 */
</script>

<style lang="scss" scoped>
.addPlant {
  width: 100%;
  height: 100%;
  background-color: #e6f5f0ee;
  padding: 10% 4%;

  .tittle {
    font-size: 40rpx;
    color: #1f9d3e;
    font-weight: bold;
  }

  .form {
    width: 90%;
    height: 100%;
    background-color: #fff;
    padding: 10% 1%;
    border-radius: 30rpx;
    margin-top: 30rpx;
  }

  .btn {
    background-color: #82c184f6;
  }
}
</style>