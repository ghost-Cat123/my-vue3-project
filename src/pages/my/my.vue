<template>
  <view class="userInfo">
    <image class="userImg" :src="userInfo.userImg" mode="scaleToFill"></image>
    <view class="username">{{ userInfo.userName }}</view>
    <view class="sign">{{ userInfo.userSign }}</view>
    <view class="email">联系方式：{{ userInfo.email }}</view>
    <view class="loc">所在地：{{ userInfo.userLoc }}</view>
    <ul class="box">
      <li class="tipBox">
        <view class="commentNum">{{ commentNum }}</view>
        <view class="tips">Total Comment</view>
      </li>
      <li class="row_br"></li>
      <li class="tipBox">
        <view class="commentNum">{{ likeNum }}</view>
        <view class="tips">Total Like</view>
      </li>
    </ul>

    <view class="br"></view>
    <view class="num">
      <view class="title">家庭宠物植物情况</view>
      <ul class="infoBox">
        <li class="pet">
          <view class="petNum">{{ petNum }}</view>
          <view class="petTip">宠物数量</view>
        </li>
        <li class="row_br"></li>
        <li class="plant">
          <view class="plantNum">{{ plantNum }}</view>
          <view class="plantTip">植物数量</view>
        </li>
      </ul>
    </view>
  </view>

  <!-- 添加任务 弹出框-->
  <uni-popup ref="popup">
    <view class="taskBox">
      <view class="addTittle">修改密码</view>
      <uni-forms class="form" ref="baseForm" :modelValue="pwd">
        <!-- 选择任务 -->
        <uni-forms-item class="formItem" label="旧密码" name="old_pwd">
          <uni-easyinput type="password" v-model="pwd.old_pwd" placeholder="请输入旧密码" />
        </uni-forms-item>
        <!-- 选择截至时间 剩余天数由该日期-当前日期-->
        <uni-forms-item class="formItem" label="新密码" name="new_pwd">
          <uni-easyinput type="password" v-model="pwd.new_pwd" placeholder="请输入新密码" />
        </uni-forms-item>
        <uni-forms-item class="formItem" label="确认密码" name="re_pwd">
          <uni-easyinput type="password" v-model="pwd.re_pwd" placeholder="请确认密码" />
        </uni-forms-item>
      </uni-forms>
      <button class="btn" type="primary" @click="submit()">提交</button>
    </view>
  </uni-popup>

  <button class="updateBtn" @click="toUpdateInfo()">修改个人信息</button>
  <button class="updatePwd" @click="popUpUpdate()">修改用户密码</button>
</template>

<script>
import { useMemberStore } from '@/stores/modules/member.js'
import { useTokenStore } from '@/stores/modules/token.js'
import { patchUpdatePwdAPI } from '@/services/member.js'

export default {
  data() {
    return {
      pwd: {
        old_pwd: '',
        new_pwd: '',
        re_pwd: ''
      },
      userInfo: {
        userImg: '../../static/images/logo.png',
        userName: "默认名称",
        email: '未填写邮箱',
        userSign: '未填写个性签名',
        userLoc: '未填写所在地'
      },
      commentNum: 0,
      likeNum: 0,
      petNum: 0,
      plantNum: 0
    }
  },

  onShow() {
    const member = useMemberStore().profile
    this.userInfo.userName = member.userName
    this.userInfo.userImg = member.userImg
    this.userInfo.email = member.email
    this.userInfo.userSign = member.userSign
    this.userInfo.userLoc = member.userLoc
  },

  methods: {
    popUpUpdate() {
      this.$refs.popup.open('bottom')
    },
    toUpdateInfo() {
      uni.navigateTo({ url: '/pages/my/updateInfo' })
    },
    async submit() {
      // 修改密码
      const res = await patchUpdatePwdAPI(this.pwd)
      // 清空用户输入
      this.$refs.popup.close()
      this.pwd.old_pwd = ''
      this.pwd.new_pwd = ''
      this.re_pwd = ''
      // 根据返回值做出相应操作
      if (res.code === 1) {
        // 清空Pinia中的数据
        useTokenStore().cleanToken
        useMemberStore().clearProfile
        // 成功回到登录页面
        uni.navigateTo({ url: '/pages/login/login' })
      } else {
        // 未成功弹出提示
        uni.showToast({ icon: 'none', title: res.message })
      }
    }
  },

}
</script>

<style lang="scss" scoped>
.userInfo {
  width: 93%;
  margin: 2%;
  background-color: #fff;
  padding: 10rpx;

  .userImg {
    margin: 20rpx;
    width: 150rpx;
    height: 150rpx;
    border-radius: 100%;
    background-color: transparent;
  }

  .username {
    font-size: 50rpx;
    margin: 20rpx 0 10rpx 30rpx;
    font-weight: bold;
  }

  .sign {
    margin-left: 35rpx;
    font-size: 35rpx;
    font-weight: 700;
  }

  .email {
    margin: 10rpx 0;
    margin-left: 30rpx;
    font-size: 30rpx;
    font-weight: 600;
    color: #888282;
  }

  .loc {
    margin-left: 30rpx;
    font-size: 30rpx;
    font-weight: 600;
    color: #888282;
  }

  .box {
    width: 90%;
    height: 170rpx;
    margin-top: 30rpx;
    border-radius: 20rpx;

    .row_br {
      float: left;
      width: 1rpx;
      height: 60%;
      margin: 3% 25rpx 0 25rpx;
      background-color: #8b8585;
    }

    .tipBox {
      float: left;
      width: 200rpx;
      height: 100%;

      .commentNum {
        margin-left: 30rpx;
        font-weight: bold;
        font-size: 35rpx;
        margin-top: 30rpx;
      }

      .tips {
        margin-left: 30rpx;
        font-size: 20rpx;
        color: #675a5a;
        margin-top: 10rpx;
      }
    }
  }

  .br {
    height: 1rpx;
    margin: 0 auto 40rpx auto;
    width: 95%;
    background-color: #888282;
  }

  .num {
    width: 90%;
    height: 300rpx;
    margin: 0 auto;
    background-color: #e9ebe4;
    border-radius: 30rpx;
    padding: 20rpx;

    .title {
      font-weight: bold;
      font-size: 40rpx;
      margin-bottom: 20rpx;
    }

    .infoBox {
      float: left;
      width: 90%;
      height: 170rpx;
      padding: 30rpx;

      .row_br {
        float: left;
        width: 1rpx;
        margin: 10rpx;
        height: 95%;
        background-color: #888282;
        margin-right: 40rpx;
      }

      .pet {
        padding-top: 20rpx;
        float: left;
        width: 200rpx;
        height: 100%;

        .petNum {
          font-weight: 1000;
          font-size: 60rpx;
        }

        .petTip {
          margin-top: 10rpx;
          font-size: 30rpx;
        }
      }

      .plant {
        padding-top: 15rpx;
        float: left;
        width: 200rpx;
        height: 100%;

        .plantNum {
          font-weight: 1000;
          font-size: 60rpx;
        }

        .plantTip {
          margin-top: 10rpx;
          font-size: 30rpx;
        }
      }
    }
  }
}

.taskBox {
  width: 92%;
  height: 800rpx;
  background-color: #def5e7;
  border-radius: 20rpx;
  margin: 0 4% 35% 4%;

  .addTittle {
    font-size: 1000;
    font-weight: bold;
    margin: 0 38%;
    margin-bottom: 100rpx;
    padding-top: 40rpx;
  }

  .form {
    height: 600rpx;
    margin-top: 100rpx;
    padding: 0 50rpx;

    .formItem {
      margin-bottom: 30rpx;
    }
  }

  .btn {
    width: 80%;
    margin: 0 auto;
  }
}

.updateBtn {
  width: 80%;
  margin: 0 auto;
  height: 90rpx;
  border: none;
  font-size: 35rpx;
  font-weight: bold;
  color: #fff;
  background-color: #27BA9B;
  border-radius: 50rpx;
}

.updatePwd {
  width: 80%;
  margin: 15rpx auto 0 auto;
  height: 90rpx;
  border: none;
  font-size: 35rpx;
  font-weight: bold;
  color: #fff;
  background-color: #27BA9B;
  border-radius: 50rpx;
}
</style>