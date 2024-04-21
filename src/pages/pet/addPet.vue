<template>
  <view class="addPet">
    <view class="tittle">请输入宠物相关信息</view>
    <view class="form" :modelValue="petInfo">
      <uni-forms>
        <uni-forms-item name="petCname" class="items" label="中文名称">
          <uni-easyinput v-model="petInfo.petCname" placeholder="请输入宠物中文名称" />
        </uni-forms-item>

        <uni-forms-item name="petEname" class="items" label="英文名称">
          <uni-easyinput v-model="petInfo.petEname" placeholder="请输入宠物英文名称" />
        </uni-forms-item>

        <uni-forms-item name="petAge" class="items" label="宠物年龄">
          <uni-number-box v-model="petInfo.petAge" @blur="blur" @focus="focus" @change="changeValue" />
        </uni-forms-item>

        <uni-forms-item name="petType" class="items" label="宠物类型">
          <uni-data-select v-model="petInfo.petType" :localdata="options" @change="change"
            :clear="false"></uni-data-select>
        </uni-forms-item>

        <uni-forms-item name="createTime" class="items" label="日期">
          <uni-datetime-picker type="datetime" :clear-icon="true" v-model="petInfo.createTime" @maskClick="maskClick" />
        </uni-forms-item>

        <uni-forms-item name="petIntro" class="items" label="宠物简介">
          <uni-easyinput type="textarea" v-model="petInfo.petIntro" placeholder="请输入宠物介绍"></uni-easyinput>
        </uni-forms-item>

        <uni-forms-item name="petImg" class="items" label="宠物图片">
          <uni-file-picker limit="1" :del-icon="false" disable-preview :imageStyles="imageStyles" file-mediatype="image"
            v-model="petInfo.petImg" file-extname="png,jpg" ref="files" :auto-upload="false"
            @select="selectFile">选择</uni-file-picker>
        </uni-forms-item>
      </uni-forms>
      <button type="primary" class="btn" @click="addPet()">添加宠物</button>
    </view>
  </view>
</template>

<script>
import { postPetAddAPI } from '@/services/pet.js'
import { useTokenStore } from '@/stores/modules/token.js'


export default {
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

      // 绑定表单数据
      petInfo: {
        petCname: '',
        petEname: '',
        petImg: '',
        petType: '',
        petIntro: '',
        petAge: ''
      },

      // 向后端传输数据
      virtueUrl: {
        file: ''
      },
    }
  },
  methods: {
    async addPet() {
      const tokenStore = useTokenStore()
      const token = tokenStore.token
      // 先上传阿里云服务器， 获取图片地址
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
          let data = JSON.parse(res.data.replace('\uFEFF', ''))
          if (data.code === 1) {
            this.petInfo.petImg = data.data
            console.log(this.petInfo);
            const addRes = await postPetAddAPI(this.petInfo)
            if (addRes.code === 1) {
              // 成功提示
              uni.showToast({ icon: 'success', title: '添加成功' })
              setTimeout(() => {
                // 页面跳转
                uni.switchTab({ url: '/pages/pet/pet' })
              }, 500)
            } else {
              uni.showToast({ icon: 'none', title: addRes.message })
            }
          } else {
            uni.showToast({ icon: 'fail', tittle: '图片上传失败' })
          }
        }
      })
    },
    // 获取虚拟地址
    selectFile(e) {
      this.virtueUrl.file = e.tempFiles[0].file.path
    },
  }
}
</script>

<style lang="scss" scoped>
.addPet {
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