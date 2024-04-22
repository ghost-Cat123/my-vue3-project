<template>
  <!-- 发帖详细信息 -->
  <view class="postBox">
    <view class="title">
      <image class="userImg" :src="defaultImg(postDetail.memberImg)"></image>
      <text class="title_username">{{ postDetail.memberName }}</text>
      <text class="title_time">{{ postDetail.createTime }}</text>
    </view>
    <view class="post">
      <text class="postContext">{{ postDetail.postContent }}</text>
    </view>
  </view>

  <!-- 帖子操作 -->
  <view class="operate">
    <view class="like">
      <image class="likeImg" :src=likeImg @click="postLike"></image>
      <view class="likeTxt" :style="postStyle">点赞 {{ showLike(postDetail.likeNum) }}</view>
    </view>
    <view class="addPost">
      <image class="postImg" src="@/static/icon/commentPost.png" @click="clickToSend"></image>
      <view class="postTxt">评论 {{ showLike(commentList.length) }}</view>
    </view>
  </view>

  <!-- 用户评论 -->
  <!-- 弹出层 -->
  <uni-popup ref="popup" :mask-click="false" class="uni_popup">
    <view class="btnBox">
      <button class="mini-btn cancel" type="primary" size="mini" @click="clickCancel">取消</button>
      <view class="tittle">
        <view class="head">写评论</view>
        <view class="memberName">用户{{ memberName }}</view>
      </view>
      <button class="mini-btn submit" type="primary" size="mini" @click="clickAdd">发布</button>
    </view>
    <view class="commentBox">
      <textarea class="commentText" v-model="sendData.commentContent" maxlength="800" wrap="hard"
        placeholder="请在此发表你的评论……"></textarea>
    </view>
  </uni-popup>

  <!-- 评论 -->
  <view class="commentTittle">热门评论</view>
  <!-- 排序按钮 -->
  <view class="orderBox" @click="changeOrder()">
    <image class="orderImg" src="@/static/icon/sort.png" mode="scaleToFill"></image>
    <view class="orderText">{{ order }}</view>
  </view>

  <!-- 评论列表 -->
  <ul class="commentList">
    <li class="commentBox" v-for="comment in commentList" :key="comment.commentId">
      <image class="memberImg" :src="comment.memberImg"></image>
      <view class="tittle">
        <view class="memberName">{{ comment.memberName }}</view>
        <view class="commentTime">{{ comment.createTime }}</view>
      </view>
      <view class="commentContent">{{ comment.commentContent }}</view>
      <view class="likeBox">
        <image class="likeIcon" @click="commentLike(comment.commentId)"
          :src="[comment.likeComment ? 'https://kanhubang.oss-cn-shanghai.aliyuncs.com/DefaultImg/like.png' : 'https://kanhubang.oss-cn-shanghai.aliyuncs.com/DefaultImg/dislike.png']"
          mode="scaleToFill">
        </image>
        <view :class="[comment.likeComment ? 'like' : 'dislike']">{{ showLike(comment.likeNum) }}</view>
      </view>
    </li>
  </ul>

</template>

<script>
import { postLikePostAPI, postIsLikePostAPI, postDislikePostAPI } from '@/services/post.js'
import { getFindCommentByLikeAPI, getFindCommentByTimeAPI, postIsLikeCommentAPI, postLikeCommentAPI, postDislikeCommentAPI, postAddCommentAPI } from '@/services/comment.js'
import { useMemberStore } from '@/stores/modules/member.js'
import { usePostStore } from '@/stores/modules/post.js'

export default {
  data() {
    return {
      // 渲染数据
      postDetail: {
        postId: 0,
        memberId: 0,
        memberImg: '',
        memberName: '',
        postContent: '',
        createTime: '',
        likeNum: 0
      },

      commentList: [],

      postStyle: {
        color: ''
      },

      commentStyle: [{
        color: ''
      }],

      memberName: '',

      // 监听数据
      likeImg: '',
      orderState: true,
      likePost: false,

      // 向后端传输数据
      postData: {
        postId: 0,
        memberId: 0
      },

      commentData: {
        commentId: 0,
        memberId: 0
      },

      sendData: {
        memberImg: '',
        postId: 0,
        commentContent: ''
      },

      id: {
        postId: 0
      }
    }
  },

  methods: {
    // 弹出层
    clickToSend() {
      this.memberName = useMemberStore().profile.userName
      this.$refs.popup.open('bottom');
    },

    clickCancel() {
      this.$refs.popup.close();
    },

    // 更改排序方式
    changeOrder() {
      this.orderState = !this.orderState
    },

    // 异步请求
    // 用户点赞发帖逻辑
    async postLike() {
      if (this.likePost === false) { // 没有点过赞 点击则点赞
        const res = await postLikePostAPI(this.postData)
        if (res.code === 1) {
          this.likePost = true
          this.postDetail.likeNum++
          uni.showToast({ url: 'success', title: '谢谢,已收到你的赞' })
        } else {
          uni.showToast({ url: 'none', title: res.message })
        }
      } else {
        const res = await postDislikePostAPI(this.postData)
        if (res.code === 1) {
          this.likePost = false
          this.postDetail.likeNum--
          uni.showToast({ url: 'success', title: '点赞已取消' })
        } else {
          uni.showToast({ url: 'none', title: res.message })
        }
      }
    },

    // 用户点赞评论逻辑
    async commentLike(commentId) {
      this.commentData.commentId = commentId;
      let likeComment = ''
      for (let comment of this.commentList) {
        if (comment.commentId === commentId) {
          likeComment = comment.likeComment
          break;
        }
      }
      if (likeComment === false) { // 没有点过赞 
        const res = await postLikeCommentAPI(this.commentData)
        if (res.code === 1) {
          this.commentList.forEach((item) => {
            if (item.commentId === commentId) {
              item.likeNum++
              item.likeComment = true
            }
          })
        } else uni.showToast({ url: 'success', title: '谢谢,已收到你的赞' })
      } else {
        const res = await postDislikeCommentAPI(this.commentData)
        if (res.code === 1) {
          this.commentList.forEach((item) => {
            if (item.commentId === commentId) {
              item.likeNum--
              item.likeComment = false
            }
          })
        } else uni.showToast({ url: 'none', title: res.message })
      }
    },

    async clickAdd() {
      this.sendData.memberImg = useMemberStore().profile.userImg
      this.sendData.postId = this.postDetail.postId
      this.id.postId = this.postDetail.postId
      const res = await postAddCommentAPI(this.sendData)
      if (res.code === 1) { // 发送成功，重新渲染评论列表
        uni.showToast({ icon: 'success', title: '评论已收到' })
        // 渲染
        // 1. 获取该帖评论列表
        const comment = await getFindCommentByLikeAPI(this.id)
        this.commentList = comment.data
        // 2. 查询该用户是否给评论点过赞
        this.commentList.forEach(async (item) => {
          this.commentData.commentId = item.commentId
          const res = await postIsLikeCommentAPI(this.commentData)
          item.likeComment = res.data
        })
        // 清空
        this.sendData.commentContent = ''
        // 关闭 弹窗
        this.$refs.popup.close();
      } else {
        uni.showToast({ icon: 'fail', title: res.message })
      }
    },

    async showInfo() {
      // 获取该帖评论列表
      const comment = await getFindCommentByLikeAPI(this.id)
      this.commentList = comment.data

      // 查询该用户是否给该帖子点过赞
      this.postData.memberId = useMemberStore().profile.userId
      this.commentData.memberId = useMemberStore().profile.userId
      const res = await postIsLikePostAPI(this.postData)
      if (res.data === true) { // 说明已经点过赞了
        this.likePost = true
      } else this.likePost = false

      // 查询该用户是否给评论点过赞
      this.commentList.forEach(async (item) => {
        this.commentData.commentId = item.commentId
        const res = await postIsLikeCommentAPI(this.commentData)
        item.likeComment = res.data
      })
    }
  },

  computed: {
    order() {
      return this.orderState === true ? '按热度' : '按时间'
    },

    defaultImg() {
      return function (memberImg) {
        return memberImg === '' ? 'https://kanhubang.oss-cn-shanghai.aliyuncs.com/DefaultImg/%E9%BB%98%E8%AE%A4%E5%A4%B4%E5%83%8F.png' : memberImg
      }
    },

    showLike() {
      return function (likeNum) {
        return likeNum === 0 ? '' : likeNum
      }
    },
  },

  watch: {
    orderState: {
      async handler(newName, oldName) {
        if (newName === true) {
          const res = await getFindAllByLikeAPI()
          this.postList = res.data
        } else {
          const res = await getFindCommentByTimeAPI()
          this.postList = res.data
        }
      }
    },

    likePost: {
      handler(newName, oldName) {
        if (newName === true) {
          this.likeImg = 'https://kanhubang.oss-cn-shanghai.aliyuncs.com/DefaultImg/likePost.png'
          this.postStyle.color = '#e7586c'
        }
        else {
          this.likeImg = 'https://kanhubang.oss-cn-shanghai.aliyuncs.com/DefaultImg/dislikePost.png'
          this.postStyle.color = '#fff9f9'
        }
      },
      immediate: true
    },
  },

  onShow() {
    // 接收pinia中的数据
    const postInfo = usePostStore()
    this.postDetail = postInfo.post
    // 后端传值数据
    this.id.postId = postInfo.post.postId
    this.postData.postId = postInfo.post.postId
    this.sendData.postId = postInfo.post.postId

    // 渲染评论和点赞信息
    this.showInfo()
  }
}
</script>

<style lang="scss" scoped>
// 帖子详情
.postBox {
  float: left;
  width: 100%;
  background-color: #fff;
  padding-bottom: 10rpx;
  border-bottom: 2px solid #ccc;

  .title {
    width: 90%;
    height: 100rpx;
    margin: 20rpx 33px 0 33rpx;
    background-color: #fff;
    float: left;
    position: relative;

    .userImg {
      width: 100rpx;
      height: 100%;
      border-radius: 100%;
      margin: 0 10rpx;
      float: left;
      border: 1px solid #ebe5e5;
    }

    .title_username {
      font-size: 35rpx;
      font-weight: bold;
      color: #b0a5a5;
      margin-left: 10rpx;
    }

    .title_time {
      font-size: 30rpx;
      font-weight: bold;
      color: #949090;
      position: absolute;
      top: 55rpx;
      left: 130rpx;
    }
  }

  .post {
    float: left;
    width: 90%;
    margin: 0 33px 0 33rpx;

    .postContext {
      width: 95%;
      padding: 20rpx;
      float: left;
    }
  }
}

// 点赞和评论
.operate {
  float: left;
  width: 100%;
  height: 100rpx;

  .like {
    float: left;
    width: 50%;
    height: 100%;
    background-color: #dab0b0;
    text-align: center;

    .likeImg {
      float: left;
      width: 60rpx;
      height: 60rpx;
      margin: 15rpx 0px 0 45px;
    }

    .likeTxt {
      float: left;
      font-size: 40rpx;
      color: #fff9f9;
      margin-top: 20rpx;
    }
  }

  .addPost {
    float: left;
    width: 50%;
    height: 100%;
    background-color: #68dedc;
    text-align: center;

    .postImg {
      float: left;
      width: 60rpx;
      height: 60rpx;
      margin: 20rpx 0px 0 45px;
    }

    .postTxt {
      float: left;
      font-size: 40rpx;
      color: #fff9f9;
      margin-top: 20rpx;
    }
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
  }
}

// 评论列表
.commentTittle {
  float: left;
  margin-left: 4%;
  margin-top: 20rpx;
  font-size: 35rpx;
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

// 评论列表
.commentList {
  float: left;
  width: 100%;
  margin-top: 10rpx;

  .commentBox {
    margin: 0 auto;
    height: 330rpx;
    width: 88%;
    padding: 20rpx;
    border-bottom: 1px solid #ccc;
  }

  .memberImg {
    float: left;
    width: 100rpx;
    height: 100rpx;
    border-radius: 100%;
    margin-right: 30rpx;
  }

  .tittle {
    float: left;
    width: 70%;

    .memberName {
      font-size: 38rpx;
      color: #121111;
      margin-bottom: 15rpx;
    }

    .commentTime {
      font-size: 30rpx;
      color: #a09d9d;
    }
  }

  .commentContent {
    float: left;
    margin-top: 20rpx;
    margin-left: 128rpx;
    width: 83%;
    height: 160rpx;
    font-size: 40rpx;
    line-height: 22px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
  }

  .likeBox {
    float: left;
    margin-left: 128rpx;

    .likeIcon {
      float: left;
      width: 40rpx;
      height: 40rpx;
      margin-right: 10rpx;
    }

    .like {
      float: left;
      font-size: 30rpx;
      color: #e7586c;
    }

    .dislike {
      float: left;
      font-size: 30rpx;
      color: #fff9f9;
    }
  }
}
</style>