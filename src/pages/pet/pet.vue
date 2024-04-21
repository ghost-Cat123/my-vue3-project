<template class="bgc">
  <view class="petHeader">
    <text class="title">我的家园</text>
    <button @click="addPet()" class="addPet" type="primary" plain="true">添加宠物</button>
  </view>

  <view class="pets">
    <view class="location" v-if="list1.length > 0">犬类</view>
    <ul class="infoList" v-if="list1.length > 0">
      <li class="infoBox" v-for="item in list1" :key="item.petId">
        <image @click="petDetail(item)" class="img" :src="item.petImg"></image>
        <view class="chineseName">{{ item.petCname }}</view>
        <view class="englishName">{{ item.petEname }}</view>
        <button @click="deletePet(item.petId, 1)" class="mini-btn" type="primary" size="mini">删除</button>
      </li>
    </ul>

    <view class="location" v-if="list2.length > 0">猫类</view>
    <ul class="infoList" v-if="list2.length > 0">
      <li class="infoBox" v-for="item in list2" :key="item.petId">
        <image @click="petDetail(item)" class="img" :src="item.petImg"></image>
        <view class="chineseName">{{ item.petCname }}</view>
        <view class="englishName">{{ item.petEname }}</view>
        <button @click="deletePlant(item.petId, 2)" class="mini-btn" type="primary" size="mini">删除</button>
      </li>
    </ul>

    <view class="location" v-if="list3.length > 0">鱼类</view>
    <ul class="infoList" v-if="list3.length > 0">
      <li class="infoBox" v-for="item in list3" :key="item.petId">
        <image @click="petDetail(item)" class="img" :src="item.petImg"></image>
        <view class="chineseName">{{ item.petCname }}</view>
        <view class="englishName">{{ item.petEname }}</view>
        <button @click="deletePlant(item.petId, 3)" class="mini-btn" type="primary" size="mini">删除</button>
      </li>
    </ul>

    <view class="location" v-if="list4.length > 0">啮齿类</view>
    <ul class="infoList" v-if="list4.length > 0">
      <li class="infoBox" v-for="item in list4" :key="item.petId">
        <image @click="petDetail(item)" class="img" :src="item.petImg"></image>
        <view class="chineseName">{{ item.petCname }}</view>
        <view class="englishName">{{ item.petEname }}</view>
        <button @click="deletePlant(item.petId, 4)" class="mini-btn" type="primary" size="mini">删除</button>
      </li>
    </ul>

    <view class="location" v-if="list5.length > 0">爬行类</view>
    <ul class="infoList" v-if="list5.length > 0">
      <li class="infoBox" v-for="item in list5" :key="item.petId">
        <image @click="petDetail(item)" class="img" :src="item.petImg"></image>
        <view class="chineseName">{{ item.petCname }}</view>
        <view class="englishName">{{ item.petEname }}</view>
        <button @click="deletePlant(item.petId, 5)" class="mini-btn" type="primary" size="mini">删除</button>
      </li>
    </ul>

  </view>
</template>

<script>
import { getPetListAPI, postPetDeleteAPI } from '@/services/pet.js'

export default {
  data() {
    return {
      userId: '',
      petImg: '',
      // 植物列表数组
      petList: [{}],
      list1: [{}], // 犬类
      list2: [{}], // 猫类
      list3: [{}], // 鱼类
      list4: [{}], // 啮齿类
      list5: [{}], // 爬行类
      // 传入后端的数据前端要封装到对象中
      data: {
        petId: 0
      }
    }
  },
  methods: {
    addPet() {
      uni.navigateTo({ url: '/pages/pet/addPet' })
    },

    petDetail(item) {
      // uni.showToast({ icon: 'loading', title: '正在加载植物信息' })
      // 向植物详情页面传值
      // 页面跳转
      uni.navigateTo({
        url: '/pages/pet/petDetail',
        success: (res) => {
          res.eventChannel.emit('showDetail', {
            id: item.petId,
            ename: item.petEname,
            cname: item.petCname,
            img: item.petImg,
            type: item.petType
          })
        },
      })
    },

    async getPetList() {
      let res = await getPetListAPI()
      this.petList = res.data
      this.list1 = this.petList.filter((item) => item.petType === '犬类')
      this.list2 = this.petList.filter((item) => item.petType === '猫类')
      this.list3 = this.petList.filter((item) => item.petType === '鱼类')
      this.list4 = this.petList.filter((item) => item.petType === '啮齿类')
      this.list5 = this.petList.filter((item) => item.petType === '爬行类')
    },
    async deletePet(petId, petType) {
      // 先删除数据库中的数据
      this.data.petId = petId
      // console.log(petId)
      const res = await postPetDeleteAPI(this.data);
      if (res.code === 1) {
        // 再删除前端数据
        if (petType === 1) this.list1 = this.list1.filter((item) => item.petId !== petId)
        if (petType === 2) this.list2 = this.list2.filter((item) => item.petId !== petId)
        if (petType === 3) this.list3 = this.list3.filter((item) => item.petId !== petId)
        if (petType === 4) this.list4 = this.list4.filter((item) => item.petId !== petId)
        if (petType === 5) this.list5 = this.list5.filter((item) => item.petId !== petId)
      } else {
        uni.showToast({ icon: 'none', title: res.message })
      }
    }
  },
  // 每一次切换到该页面都会渲染一次列表
  onShow() {
    this.getPetList()
  }
}
</script>

<style lang="scss" scoped>
.bgc {
  background-color: #F2F2F7;
}

.petHeader {
  width: 91%;
  height: 80rpx;
  padding: 20rpx;
  margin-left: 2%;

  .title {
    float: left;
    font-weight: bold;
    font-size: 50rpx;
    margin-top: 10rpx;
  }

  .addPet {
    float: right;
    width: 200rpx;
    height: 80rpx;
    font-size: 30rpx;
    font-weight: bold;
    background-color: #27BA9B;
    color: #fff;
  }
}

.pets {
  width: 91%;
  background-color: #F2F2F7;
  padding: 20rpx;
  margin-left: 2%;
  margin-top: 8rpx;

  .location {
    height: 70rpx;
    font-size: 40rpx;
    font-weight: 700;
  }

  .infoList {
    width: 100%;
    background-color: #fff;
    border: 1px solid #fff;
    overflow: hidden;
    border-radius: 30rpx;

    .infoBox {
      padding: 10rpx;
      height: 100rpx;
      border-bottom: 1px solid #ccc;
      position: relative;

      .img {
        width: 100rpx;
        height: 100rpx;
        background-color: #456545;
        border-radius: 10%;
        float: left;
      }

      .chineseName {
        float: left;
        margin-left: 10rpx;
        font-weight: bold;
      }

      .englishName {
        position: absolute;
        top: 65rpx;
        left: 120rpx;
        font-size: small;
      }

      .mini-btn {
        position: absolute;
        left: 510rpx;
        top: 27rpx;
      }
    }
  }
}
</style>