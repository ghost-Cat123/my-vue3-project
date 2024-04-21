<template>
  <view class="viewport">
    <view class="logo">
      <image src='../../static/images/logo.png'></image>
    </view>

    <uni-forms class="login" :modelValue="form">
      <uni-forms-item name="userName">
        <uni-easyinput type="text" class="input" v-model="form.userName" placeholder="请输入用户名" />
      </uni-forms-item>
      <uni-forms-item name="userPassword">
        <uni-easyinput type="password" v-model="form.userPassword" placeholder="请输入密码" />
      </uni-forms-item>
      <button @tap="clickLogin()" class="btn" form-type="submit" type="primary">登录</button>
      <button @tap="clickToRegister()" class="btn" type="primary">注册</button>
    </uni-forms>
    <view class="tips">登录/注册即视为你同意《服务条款》和《看护帮隐私协议》</view>
  </view>
</template>

<script lang="js">
import { useMemberStore } from '@/stores/modules/member.js'
import { useTokenStore } from '@/stores/modules/token.js'
import { postLoginAPI, getMemberInfoAPI } from "@/services/member";
export default {
  data() {
    return {
      form: {
        userName: '',
        userPassword: ''
      }
    }
  },
  methods: {
    async clickLogin() {
      // 后端发请求获取数据
      const res = await postLoginAPI(this.form)
      // 存储登录信息
      const tokenStore = useTokenStore()
      tokenStore.setToken(res.data)
      if (res.date == null && res.code == 0) {
        uni.showToast({ icon: 'none', title: res.message })
      }
      else {
        // 登录成功后获取用户信息 存储至Pinia中
        const memberInfo = await getMemberInfoAPI()
        const memberStore = useMemberStore()
        memberStore.setProfile(memberInfo.data)
        // 成功提示
        uni.showToast({ icon: 'success', title: '登录成功' })
        setTimeout(() => {
          // 页面跳转
          uni.switchTab({ url: '/pages/community/community' })
        }, 500)
      }
    },

    clickToRegister() {
      this.form.userName = ''
      this.form.userPassword = ''
      uni.navigateTo({ url: '/pages/register/register' })
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

.login {
  display: flex;
  flex-direction: column;
  height: 60vh;
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

  .btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 80rpx;
    font-size: 33rpx;
    border-radius: 72rpx;
    margin-top: 20rpx !important;
    color: #fff;

    .icon {
      font-size: 40rpx;
      margin-right: 6rpx;
    }
  }

  .loginBtn {
    background-color: #35b653;
  }

  .registerBtn {
    background-color: #46775e;
    margin-top: 20rpx;
  }

  .extra {
    flex: 1;
    padding: 70rpx 70rpx 0;

    .caption {
      width: 440rpx;
      line-height: 1;
      border-top: 1rpx solid #ddd;
      font-size: 26rpx;
      color: #999;
      position: relative;

      text {
        transform: translate(-40%);
        background-color: #fff;
        position: absolute;
        top: -12rpx;
        left: 50%;
      }
    }

    .options {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 70rpx;


      button {
        padding: 10rpx;
        background-color: transparent;

        &::after {
          border: none;
        }
      }
    }

    .icon {
      font-size: 24rpx;
      color: #444;
      display: flex;
      flex-direction: column;
      align-items: center;

      &::before {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 80rpx;
        height: 80rpx;
        margin-bottom: 6rpx;
        font-size: 40rpx;
        border: 1rpx solid #444;
        border-radius: 50%;
      }
    }

    .icon-weixin::before {
      border-color: #06c05f;
      color: #06c05f;
    }
  }
}

.tips {
  position: absolute;
  bottom: 80rpx;
  left: 20rpx;
  right: 20rpx;
  font-size: 22rpx;
  color: #999;
  text-align: center;
}

.btn {
  margin-top: 20rpx;
  border-radius: 60rpx;
  font-size: 35rpx;
}
</style>