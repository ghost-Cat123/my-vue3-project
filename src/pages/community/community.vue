<template>
  <view class="navbar">
    <!-- logo文字 -->
    <view class="logo">
      <text class="logo-text">看护帮 | 家庭动物植物看护社群</text>
    </view>
    <!-- 搜索条 -->
    <view>
      <uni-search-bar v-model="searchValue.queryCondition" :radius="50" placeholder="请输入关键词搜索"
        @confirm="search()"></uni-search-bar>
    </view>
  </view>

  <view class="orderBox" @click="changeOrder()">
    <image class="orderImg" src="@/static/icon/sort.png" mode="'scaleToFill'"></image>
    <view class="orderText">{{ order }}</view>
  </view>

  <view class="postBox" v-for="postInfo in postList" :key="postInfo.postId">
    <image class="postImg" @click="toCommentDetails(postInfo.postId)" :src="defaultImg(postInfo.memberImg)"
      mode="'scaleToFill'"></image>
    <view class="postTittle">
      <view class="postName">{{ postInfo.memberName }}</view>
      <view class="postTime">{{ postInfo.updateTime }}</view>
    </view>
    <view class="postBr"></view>
    <view class="postContent">{{ postInfo.postContent }}</view>
  </view>

  <!-- 弹出按钮 -->
  <uni-fab ref="fab" :pattern="pattern" horizontal="right" vertical="bottom" @fabClick="fabClick()" />

  <!-- 弹出层 -->
  <uni-popup ref="popup" :mask-click="false" class="uni_popup">
    <view class="btnBox">
      <button class="mini-btn cancel" type="primary" size="mini" @click="clickCancel()">取消</button>
      <view class="tittle">
        <view class="head">写帖子</view>
        <view class="memberName">用户{{ memberName }}</view>
      </view>
      <button class="mini-btn submit" type="primary" size="mini" @click="clickSubmit()">发布</button>
    </view>
    <view class="commentBox">
      <textarea class="commentText" v-model="postInfo.postContent" maxlength="800" wrap="hard"
        placeholder="请在此输入你想分享的内容……"></textarea>
    </view>
  </uni-popup>

</template>

<script lang="js">
import { getFindAllByLikeAPI, getFindAllByTimeAPI, postFuzzyQueryAPI, postSendPostAPI } from '@/services/post.js'
import { useMemberStore } from '@/stores/modules/member.js'

export default {
  data() {
    return {
      postList: [{
        memberId: 0,
        memberImg: '',
        memberName: '',
        updateTime: '',
        postContent: ''
      }],

      pattern: {
        buttonColor: '#27BA9B',
      },

      memberName: '',

      orderState: true,

      // 后端传值
      searchValue: {
        queryCondition: ''
      },

      postInfo: {
        memberImg: useMemberStore().profile.userImg,
        postContent: ''
      }
    }
  },

  methods: {
    // 跳转到评论详情页
    toCommentDetails(possId) {
      uni.showToast({ icon: 'loading', title: '加载评论详情' })
      uni.navigateTo({
        url: '/pages/community/PostDetails',
        success: (res) => {
          res.eventChannel.emit('PostDetail', {
            id: possId
          })
        },
      })
    },

    // 弹出弹出层
    fabClick() {
      this.memberName = useMemberStore().profile.userName
      this.$refs.popup.open('bottom');
    },
    // 关闭弹出层
    clickCancel() {
      this.$refs.popup.close();
    },

    changeOrder() {
      this.orderState = !this.orderState
    },

    // 请求
    async getPostList() {
      const res = await getFindAllByLikeAPI()
      this.postList = res.data
    },

    async search() {
      const res = await postFuzzyQueryAPI(this.searchValue)
      this.postList = res.data
    },

    async clickSubmit() {
      if (this.postInfo.postContent.trim === '') {
        uni.showToast({ icon: 'fail', title: '请输入发帖内容' })
        return
      }
      const res = await postSendPostAPI(this.postInfo)
      if (res.code === 1) {
        this.postInfo.postContent = ''
        uni.showToast({ icon: 'success', title: '发帖成功' })
        this.$refs.popup.close();
        this.getPostList()
      }
    }
  },

  computed: {
    // 计算任务状态
    defaultImg() {
      return function (memberImg) {
        return memberImg === '' && this.postList.length !== 0 ? 'https://kanhubang.oss-cn-shanghai.aliyuncs.com/DefaultImg/%E9%BB%98%E8%AE%A4%E5%A4%B4%E5%83%8F.png' : memberImg
      }
    },
    order() {
      return this.orderState === true ? '按热度' : '按时间'
    }
  },

  watch: {
    orderState: {
      async handler(newName, oldName) {
        if (newName === true) {
          const res = await getFindAllByLikeAPI()
          this.postList = res.data
        } else {
          const res = await getFindAllByTimeAPI()
          this.postList = res.data
        }
      }
    }
  },

  onShow() {
    this.getPostList()
  },
}
</script>

<style lang="scss" scoped>
/* 自定义导航条 */
.navbar {
  background-color: #27BA9B;
  background-size: cover;
  position: relative;
  display: flex;
  flex-direction: column;
  padding-top: 20px;

  .logo {
    display: flex;
    align-items: center;
    height: 64rpx;
    padding-left: 30rpx;

    .logo-text {
      flex: 1;
      line-height: 28rpx;
      color: #fff;
      margin: 2rpx 0 0 3rpx;
      padding-left: 20rpx;
      font-size: 33rpx;
    }
  }

  .search {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10rpx 0 26rpx;
    height: 64rpx;
    margin: 16rpx 20rpx;
    color: #fff;
    font-size: 28rpx;
    border-radius: 32rpx;
    background-color: rgba(255, 255, 255, 0.5);
  }

  .icon-search {
    &::before {
      margin-right: 10rpx;
    }
  }

  .icon-scan {
    font-size: 30rpx;
    padding: 15rpx;
  }
}

// 排序按钮
.orderBox {
  float: right;
  margin-right: 4%;
  margin-top: 20rpx;

  .orderImg {
    float: left;
    height: 48rpx;
    width: 48rpx;
    margin-right: 10rpx;
  }

  .orderText {
    float: left;
    color: #d2d1d1;
    font-size: 35rpx;
  }
}

// 评论
.postBox {
  float: left;
  width: 92%;
  height: 340rpx;
  margin: 30rpx 4% 30rpx 4%;
  border-radius: 12rpx;
  box-shadow: 0px 0px 3px 1px rgba(0, 0, 0, 0.08);

  .postImg {
    float: left;
    width: 95rpx;
    height: 95rpx;
    border-radius: 50%;
    margin: 30rpx 30rpx 20rpx 55rpx;
  }

  .postTittle {
    float: left;
    height: 100rpx;
    width: 66%;
    margin: 30rpx 0 20rpx 0;

    .postName {
      width: 100%;
      font-size: 15px;
      color: #3a3a3a;
    }

    .postTime {
      width: 100%;
      font-size: 12px;
      margin-top: 5px;
      color: #909399
    }
  }

  .postBr {
    float: left;
    height: 1rpx;
    width: 92%;
    margin: 0 4%;
    background-color: #EBEEF5;
  }

  .postContent {
    float: left;
    height: 160rpx;
    width: 84%;
    margin: 10rpx 8%;
    font-size: 14px;
    color: #6a6a6a;
    line-height: 22px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
  }
}

// 弹出层
.uni_popup {
  .btnBox {
    float: left;
    width: 100%;
    height: 100rpx;
    background-color: #f6e6e6;
    text-align: center;

    .cancel {
      float: left;
      margin-top: 15rpx;
      margin-left: 10rpx;
    }

    .submit {
      float: right;
      margin-top: 15rpx;
      margin-right: 10rpx;
    }

    .tittle {
      float: left;
      width: 230rpx;
      margin: 1.5% 80rpx;
      margin-left: 100rpx;

      .head {
        font-size: 35rpx;
        margin: 0 auto;
        margin-bottom: 5rpx;
      }

      .memberName {
        font-size: 28rpx;
        margin: 0 auto;
        color: #b5a1a1;
      }
    }
  }

  .commentBox {
    width: 100%;
    height: 800rpx;
    background-color: #fff;

    .commentText {
      width: 95%;
      height: 550rpx;
      color: #494747;
      font-size: 37rpx;
      padding: 15rpx 20rpx;
      border: 1px solid black;
      border-bottom: none;
    }

    .uploadImg {
      width: 96%;
      height: 450rpx;
    }
  }
}
</style>