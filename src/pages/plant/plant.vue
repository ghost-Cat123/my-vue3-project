<template class="bgc">
  <view class="plantHeader">
    <text class="title">我的家园</text>
    <button @click="addPlant()" class="addPlant" type="primary" plain="true">添加绿植</button>
  </view>

  <view class="plants">
    <view class="location" v-if="list1.length > 0">阳台</view>
    <ul class="infoList" v-if="list1.length > 0">
      <li class="infoBox" v-for="item in list1" :key="item.plantId">
        <image @click="plantDetail(item)" class="img" :src="item.plantImg"></image>
        <uni-badge class="dot" :text="item.unfinishedTask" />
        <view class="chineseName">{{ item.plantCname }}</view>
        <view class="englishName">{{ item.plantEname }}</view>
        <button @click="deletePlant(item.plantId, 1)" class="mini-btn" type="primary" size="mini">删除</button>
      </li>
    </ul>

    <view class="location" v-if="list2.length > 0">书房</view>
    <ul class="infoList" v-if="list2.length > 0">
      <li class="infoBox" v-for="item in list2" :key="item.plantId">
        <image @click="plantDetail(item)" class="img" :src="item.plantImg"></image>
        <view class="chineseName">{{ item.plantCname }}</view>
        <view class="englishName">{{ item.plantEname }}</view>
        <button @click="deletePlant(item.plantId, 2)" class="mini-btn" type="primary" size="mini">删除</button>
      </li>
    </ul>

    <view class="location" v-if="list3.length > 0">客厅</view>
    <ul class="infoList" v-if="list3.length > 0">
      <li class="infoBox" v-for="item in list3" :key="item.plantId">
        <image @click="plantDetail(item)" class="img" :src="item.plantImg"></image>
        <view class="chineseName">{{ item.plantCname }}</view>
        <view class="englishName">{{ item.plantEname }}</view>
        <button @click="deletePlant(item.plantId, 3)" class="mini-btn" type="primary" size="mini">删除</button>
      </li>
    </ul>

    <view class="location" v-if="list4.length > 0">餐厅</view>
    <ul class="infoList" v-if="list4.length > 0">
      <li class="infoBox" v-for="item in list4" :key="item.plantId">
        <image @click="plantDetail(item)" class="img" :src="item.plantImg"></image>
        <view class="chineseName">{{ item.plantCname }}</view>
        <view class="englishName">{{ item.plantEname }}</view>
        <button @click="deletePlant(item.plantId, 4)" class="mini-btn" type="primary" size="mini">删除</button>
      </li>
    </ul>

    <view class="location" v-if="list5.length > 0">主卧</view>
    <ul class="infoList" v-if="list5.length > 0">
      <li class="infoBox" v-for="item in list5" :key="item.plantId">
        <image @click="plantDetail(item)" class="img" :src="item.plantImg"></image>
        <view class="chineseName">{{ item.plantCname }}</view>
        <view class="englishName">{{ item.plantEname }}</view>
        <button @click="deletePlant(item.plantId, 5)" class="mini-btn" type="primary" size="mini">删除</button>
      </li>
    </ul>

    <view class="location" v-if="list6.length > 0">客卧</view>
    <ul class="infoList" v-if="list6.length > 0">
      <li class="infoBox" v-for="item in list6" :key="item.plantId">
        <image @click="plantDetail(item)" class="img" :src="item.plantImg"></image>
        <view class="chineseName">{{ item.plantCname }}</view>
        <view class="englishName">{{ item.plantEname }}</view>
        <button @click="deletePlant(item.plantId, 6)" class="mini-btn" type="primary" size="mini">删除</button>
      </li>
    </ul>

  </view>
</template>

<script>
import { getPlantListAPI, postPlantDeleteAPI } from '@/services/plant.js'
import { usePlantStore } from '@/stores/modules/plant.js'

export default {
  data() {
    return {
      userId: '',
      plantImg: '',
      // 植物列表数组
      plantList: [{}],
      list1: [{}],
      list2: [{}],
      list3: [{}],
      list4: [{}],
      list5: [{}],
      list6: [{}],
      // 传入后端的数据前端要封装到对象中
      data: {
        plantId: 0
      }
    }
  },
  methods: {
    addPlant() {
      uni.navigateTo({ url: '/pages/plant/addPlant' })
    },

    plantDetail(item) {
      // 向植物详情页面传值
      const plantInfo = usePlantStore()
      plantInfo.clearPlant()
      plantInfo.setPlant(item)
      // 页面跳转
      uni.navigateTo({url: '/pages/plant/plantDetail'})
    },

    async getPlantList() {
      let res = await getPlantListAPI()
      this.plantList = res.data
      // this.plantList.forEach(async (plant) => {
      //   this.data.plantId = plant.plantId
      //   const unfinishedTask = await getUnfinishedTaskAPI(this.data)
      //   plant.unfinishedTask = unfinishedTask.data
      // })
      this.list1 = this.plantList.filter((item) => item.plantLoc === '阳台')
      this.list2 = this.plantList.filter((item) => item.plantLoc === '书房')
      this.list3 = this.plantList.filter((item) => item.plantLoc === '客厅')
      this.list4 = this.plantList.filter((item) => item.plantLoc === '餐厅')
      this.list5 = this.plantList.filter((item) => item.plantLoc === '主卧')
      this.list6 = this.plantList.filter((item) => item.plantLoc === '客卧')
    },
    async deletePlant(plantId, plantLoc) {
      // 先删除数据库中的数据
      console.log(plantId)
      this.data.plantId = plantId
      // console.log(plantId)
      const res = await postPlantDeleteAPI(this.data);
      if (res.code === 1) {
        // 再删除前端数据
        if (plantLoc === 1) this.list1 = this.list1.filter((item) => item.plantId !== plantId)
        if (plantLoc === 2) this.list2 = this.list2.filter((item) => item.plantId !== plantId)
        if (plantLoc === 3) this.list3 = this.list3.filter((item) => item.plantId !== plantId)
        if (plantLoc === 4) this.list4 = this.list4.filter((item) => item.plantId !== plantId)
        if (plantLoc === 5) this.list5 = this.list5.filter((item) => item.plantId !== plantId)
        if (plantLoc === 6) this.list6 = this.list6.filter((item) => item.plantId !== plantId)
      } else {
        uni.showToast({ icon: 'none', title: res.message })
      }
    }
  },
  // 每一次切换到该页面都会渲染一次列表
  onShow() {
    this.getPlantList()
  }
}
</script>

<style lang="scss" scoped>
.bgc {
  background-color: #F2F2F7;
}

.plantHeader {
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

  .addPlant {
    float: right;
    width: 200rpx;
    height: 80rpx;
    font-size: 30rpx;
    font-weight: bold;
    background-color: #27BA9B;
    color: #fff;
  }
}

.plants {
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

      .dot {
        position: relative;
        top: -20rpx;
        right: 202rpx;
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