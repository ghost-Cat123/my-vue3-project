<template>
  <view class="addPlant">
    <view class="tittle">请输入植物相关信息</view>
    <view class="form" :modelValue="plantInfo">
      <uni-forms-item name="plantImg" class="items" label="植物图片">
        <uni-file-picker limit="1" :del-icon="false" disable-preview :imageStyles="imageStyles" file-mediatype="image"
          v-model="plantImg" file-extname="png,jpg" ref="files" :auto-upload="false"
          @select="selectFile">选择</uni-file-picker>
      </uni-forms-item>

      <uni-forms>
        <uni-forms-item name="plantCname" class="items" label="中文名称">
          <uni-easyinput v-model="plantInfo.plantCname" placeholder="请输入植物中文名称" />
        </uni-forms-item>

        <uni-forms-item name="plantEname" class="items" label="英文名称">
          <uni-easyinput v-model="plantInfo.plantEname" placeholder="请输入植物英文名称" />
        </uni-forms-item>

        <uni-forms-item name="plantAge" class="items" label="植物年龄">
          <uni-number-box v-model="plantInfo.plantAge" />
        </uni-forms-item>

        <uni-forms-item name="plantLoc" class="items" label="放置位置">
          <uni-data-select v-model="plantInfo.plantLoc" :localdata="options" :clear="false"></uni-data-select>
        </uni-forms-item>

        <uni-forms-item name="plantIntro" class="items" label="植物简介">
          <uni-easyinput type="textarea" v-model="plantInfo.plantIntro" placeholder="请输入植物介绍"></uni-easyinput>
        </uni-forms-item>

      </uni-forms>
      <button type="primary" class="btn" @click="updatePlant()">更新绿植</button>
    </view>
  </view>
</template>

<script>
import { postPlantInfoUpdateAPI } from '@/services/plant.js'
import { useTokenStore } from '@/stores/modules/token.js'


export default {
  // 数据
  data() {
    return {
      // 表单数据
      options: [
        { value: "", text: "请选择位置", disable: true },
        { value: "阳台", text: "阳台" },
        { value: "书房", text: "书房" },
        { value: "客卧", text: "客卧" },
        { value: "客厅", text: "客厅" },
        { value: "餐厅", text: "餐厅" },
        { value: "主卧", text: "主卧" }
      ],
      imageStyles: {
        width: 90,
        height: 90,
        border: {
          radius: '10%'
        },
      },

      // 表单绑定数据
      plantInfo: {
        plantId: 0,
        plantCname: '',
        plantEname: '',
        plantImg: '',
        plantLoc: '',
        createTime: '',
        plantIntro: '',
        plantAge: ''
      },

      // 向后端传递数据
      virtueUrl: {
        file: ''
      },
      plantImg: {
        fileId: 0,
        url: ''
      }
    }
  },

  // 方法
  methods: {
    // 获取虚拟地址
    selectFile(e) {
      this.virtueUrl.file = e.tempFiles[0].file.path
    },

    // 更新植物信息
    async updatePlant() {
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
              this.plantInfo.plantImg = data.data
              const updateRes = await postPlantInfoUpdateAPI(this.plantInfo)
              if (updateRes.code === 1) {
                // 成功提示
                uni.showToast({ icon: 'success', title: '更新成功' })
                setTimeout(() => {
                  // 页面跳转
                  uni.switchTab({ url: '/pages/plant/plant' })
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
        const updateRes = await postPlantInfoUpdateAPI(this.plantInfo)
        if (updateRes.code === 1) {
          // 成功提示
          uni.showToast({ icon: 'success', title: '更新成功' })
          setTimeout(() => {
            // 页面跳转
            uni.switchTab({ url: '/pages/plant/plant' })
          }, 500)
        } else {
          uni.showToast({ icon: 'none', title: updateRes.message })
        }
      }
    },
  },

  // 生命周期钩子函数
  onShow() {
    let eventChannel = this.getOpenerEventChannel()
    // 监听fresh事件，获取上一页面通过eventChannel传送到当前页面的数据
    // 局部变量接收传递数据
    let data = this.plantInfo
    // 后触发 此时页面数据与 页面方法还未渲染
    eventChannel.on('addInfo', function (res) {
      // res为接收信息
      data.id = res.id
      data.ename = res.ename
      data.cname = res.cname
      data.img = res.img
      data.loc = res.loc
      data.intro = res.intro
      data.age = res.age
    })

    // 先触发 延时 变成后触发
    setTimeout(() => {
      // 接收上一页面数据
      this.plantInfo.plantId = data.id
      this.plantInfo.plantEname = data.ename
      this.plantInfo.plantCname = data.cname
      this.plantInfo.plantImg = data.img
      this.plantInfo.plantLoc = data.loc
      this.plantInfo.plantIntro = data.intro
      this.plantInfo.plantAge = data.age
      this.plantImg.url = data.img
    }, 500)
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