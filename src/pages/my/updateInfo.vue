<template>
  <view class="addPlant">
    <view class="tittle">修改个人信息</view>
    <view class="form">
      <uni-forms :modelValue="userInfo">
        <uni-forms-item name="userImg" class="items" label="用户头像">
          <uni-file-picker limit="1" :del-icon="false" disable-preview :imageStyles="imageStyles" file-mediatype="image" v-model="memberImg" file-extname="png,jpg" :auto-upload="false"
            @select="selectFile">选择</uni-file-picker>
        </uni-forms-item>

        <uni-forms-item name="userName" class="items" label="用户名">
          <uni-easyinput v-model="userInfo.userName" placeholder="请输入用户名" />
        </uni-forms-item>

        <uni-forms-item name="email" class="items" label="邮箱">
          <uni-easyinput v-model="userInfo.email" placeholder="请输入您的邮箱" />
        </uni-forms-item>

        <uni-forms-item name="userSign" class="items" label="个性签名">
          <uni-easyinput v-model="userInfo.userSign" placeholder="请输入个性签名" />
        </uni-forms-item>

        <uni-forms-item name="userLoc" class="items" label="地区">
          <uni-easyinput v-model="userInfo.userLoc" placeholder="请输入您所在的地区" />
        </uni-forms-item>

      </uni-forms>
      <button type="primary" class="btn" @click="updateInfo">修改信息</button>
    </view>
  </view>
</template>

<script>
import { useMemberStore } from '@/stores/modules/member.js'
import { useTokenStore } from '@/stores/modules/token.js'
import { postUpdateMemberAPI } from '@/services/member.js'

export default {
  data() {
    return {
      userInfo: {
        userId: 0,
        userName: '',
        userImg: '',
        userLoc: '',
        email: '',
        userSign: ''
      },
      imageStyles: {
        width: 90,
        height: 90,
        border: {
          radius: '50%'
        },
      },
      memberImg: {
        fileId: 0,
        url: ''
      },
      virtueUrl: {
        file: ''
      }
    }
  },
  methods: {
    selectFile(e) {
      this.virtueUrl.file = e.tempFiles[0].file.path
    },
    async updateInfo() {
      // 有图片则上传图片
      if (this.virtueUrl.file !== '') {
        // 先上传阿里云服务器， 获取图片地址
        const tokenStore = useTokenStore()
        const token = tokenStore.token

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
              this.userInfo.userImg = data.data;
              const updateRes = await postUpdateMemberAPI(this.userInfo)
              if (updateRes.code === 1) {
                uni.showToast({ icon: 'success', title: '修改成功' })
                useMemberStore().setProfile(this.userInfo)
                setTimeout(() => {
                  // 页面跳转
                  uni.switchTab({ url: '/pages/my/my' })
                }, 500)
              } else {
                uni.showToast({ icon: 'fail', title: updateRes.message })
                // 用户名被占用 清空用户名
                this.userInfo.userName = ''
              }
            } else {
              uni.showToast({ icon: 'fail', tittle: '图片上传失败' })
            }
          }
        })
      } else {
        // 无图片则只更新个人基本信息
        const updateRes = await postUpdateMemberAPI(this.userInfo)
        if (updateRes.code === 1) {
          uni.showToast({ icon: 'success', title: '修改成功' })
          useMemberStore().setProfile(this.userInfo)
          setTimeout(() => {
            // 页面跳转
            uni.switchTab({ url: '/pages/my/my' })
          }, 500)
        } else {
          uni.showToast({ icon: 'fail', title: updateRes.message })
          // 用户名被占用 清空用户名
          this.userInfo.userName = ''
        }
      }
    }
  },

  onShow() {
    const member = useMemberStore().profile
    this.userInfo = member
    this.memberImg.url = member.userImg
  }
}
</script>

<style lang="scss" scoped>
.addPlant {
  width: 100%;
  height: 100%;
  background-color: #e6f5f0ee;
  padding: 15% 4%;

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