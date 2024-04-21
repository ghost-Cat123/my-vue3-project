<template>
  <view class="viewport">
    <view class="logo">
      <image src='../../static/images/logo.png'></image>
    </view>

    <uni-forms class="register" :modelValue="input">
      <uni-forms-item name="userName">
        <uni-easyinput type="text" :styles="inputStyle" v-model="input.userName" placeholder="请输入用户名" />
      </uni-forms-item>
      <uni-forms-item name="userPassword">
        <uni-easyinput type="password" :styles="inputStyle" v-model="input.userPassword" placeholder="请输入密码" />
      </uni-forms-item>
      <uni-forms-item>
        <uni-easyinput type="password" :styles="inputStyle" v-model="confirmPwd" placeholder="确认密码" />
      </uni-forms-item>
      <button @tap="clickRegister()" class="btn" type="primary">注册</button>
    </uni-forms>


  </view>
</template>

<script>
import { postRegisterAPI } from "@/services/member"
export default {
  data() {
    return {
      input: {
        userName: '',
        userPassword: '',
      },
      confirmPwd: '',
      inputStyle: {
        fontSize: "28rpx",
        borderColor: '#27BA9B'
      }
    }
  },
  methods: {
    async clickRegister() {
      // 前端手动校验
      if (this.input.userPassword !== this.confirmPwd) {
        uni.showToast({ icon: 'none', title: '两次输入密码不一致' })
        return;
      }
      // 后端发请求,新增用户信息
      await postRegisterAPI(this.input)
      // 成功提示
      uni.showToast({ icon: 'success', title: '注册成功' })
      setTimeout(() => {
        // 页面跳转
        uni.navigateTo({ url: '/pages/login/login' })
      }, 500)
    }
  }
}
</script>

<style lang="scss" scoped>
page {
  height: 100%;
}

.viewport {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20rpx 40rpx;
}

.logo {
  flex: 1;
  text-align: center;

  image {
    width: 220rpx;
    height: 220rpx;
    margin-top: 15vh;
  }
}

.register {
  display: flex;
  flex-direction: column;
  height: 30vh;
  padding: 40rpx 20rpx 35rpx;

  .input {
    width: 100%;
    height: 80rpx;
    font-size: 28rpx;
    border-radius: 72rpx;
    border: 1px solid #ddd;
    padding-left: 30rpx;
    margin-bottom: 20rpx;
  }

  .icon {
    font-size: 40rpx;
    margin-right: 6rpx;
  }
}

.btn {
  border-radius: 60rpx;
  font-size: 37rpx;
}
</style>