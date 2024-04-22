<template>
  <view class="petInfo">
    <image class="petImg" :src=petInfo.petImg></image>
    <button class="updateBtn" type="primary" size="mini" @click="updatePet()">修改</button>
    <view class="cName">{{ petInfo.petCname }}</view>
    <view class="eName">{{ petInfo.petEname }}</view>
    <view class="intro">{{ petInfo.petIntro }}</view>
    <view class="age">年龄：{{ petInfo.petAge }}</view>
    <view class="loc">种类：{{ petInfo.petType }}</view>
  </view>

  <view class="task">
    <view class="taskTittle">已安排的任务</view>
    <!-- 任务卡片 -->
    <view class="taskCard" v-for="task in taskList" :key="task.taskId">
      <view class="taskBox">
        <image name="taskImg" class="taskImg" src="@/static/icon/petTask.png"></image>
        <view name="taskName" class="taskName">{{ task.taskName }}</view>
      </view>

      <view class="time">
        <view name="taskTime" class="taskTime">{{ formatTime(task.expireTime) }}</view>
        <view name="taskState" class="taskState">{{ taskState(task.taskState) }}</view>
      </view>

      <view class="opeBox">
        <view class="ope" @click="finishTask(task.taskId)">
          <image class="opeImg" src="@/static/icon/finishTask.png"></image>
          <view class="opeTxt">完成</view>
        </view>
        <view class="ope" @click="toUpdateTask(task)">
          <image class="opeImg" src="@/static/icon/updateTask.png"></image>
          <view class="opeTxt">修改</view>
        </view>
        <view class="ope border" @click="deleteTask(task.taskId)">
          <image class="opeImg" src="@/static/icon/deleteTask.png"></image>
          <view class="opeTxt">删除</view>
        </view>
      </view>
    </view>

    <view class="addtask">
      <uni-icons type="plusempty" size="85" class="add" color="#ffffff" @click="popUpAdd()"></uni-icons>
    </view>

    <!-- 添加任务 弹出框-->
    <uni-popup ref="popup">
      <view class="popBox">
        <view class="addTittle">添加任务</view>
        <uni-forms class="form" ref="baseForm" :modelValue="taskFormData">
          <!-- 选择任务 -->
          <uni-forms-item class="formItem" label="任务名称">
            <uni-easyinput v-model="taskFormData.taskName" placeholder="任务名称" />
          </uni-forms-item>

          <!-- 选择截至时间 剩余天数由该日期-当前日期-->
          <uni-forms-item class="formItem" label="完成时间">
            <uni-datetime-picker type="datetime" v-model="taskFormData.expireTime" />
          </uni-forms-item>
        </uni-forms>
        <button class="btn" type="primary" @click="addTask()">提交</button>
      </view>
    </uni-popup>

    <uni-popup ref="popUpdate">
      <view class="popBox">
        <view class="addTittle">修改任务</view>
        <uni-forms class="form" ref="baseForm" :modelValue="taskFormData">
          <!-- 选择任务 -->
          <uni-forms-item class="formItem" label="任务名称">
            <uni-easyinput v-model="taskFormData.taskName" placeholder="任务名称" />
          </uni-forms-item>

          <!-- 选择截至时间 剩余天数由该日期-当前日期-->
          <uni-forms-item class="formItem" label="完成时间">
            <uni-datetime-picker type="datetime" v-model="taskFormData.expireTime" />
          </uni-forms-item>
        </uni-forms>
        <button class="btn" type="primary" @click="updateTask()">提交</button>
      </view>
    </uni-popup>
  </view>

  <view class="tools">
    <view class="tittle">笔记与照片</view>
    <view class="picture">
      <!-- 图片上传组件 -->
      <view class="uploadImg">
        <uni-file-picker class="img" limit="9"></uni-file-picker>
      </view>
      <view class="imagesBox">
        <image class="image"></image>
        <image class="image"></image>
        <image class="image"></image>
        <image class="image"></image>
      </view>
    </view>
    <view class="br"></view>
    <view class="noteBox">
      <view class="tips">我的笔记</view>
      <button class="saveNote" size="mini" @click="saveNote()">保存</button>
      <textarea class="note" v-model="note.petNote" maxlength="400" placeholder="请输入您的笔记" auto-height></textarea>
    </view>
  </view>
</template>

<script>
import { getPetInfoAPI, postAddPetTaskAPI, getPetTaskAPI, postUpdatePetTaskAPI, postDeleteTaskAPI, postFinishTaskAPI, postPetNoteUpdateAPI } from '@/services/pet.js'
import { usePetStore } from '@/stores/modules/pet.js'

export default {
  data() {
    return {
      listStyles: {
        // 是否显示边框
        border: true,
        // 是否显示分隔线
        dividline: true,
        // 线条样式
        borderStyle: {
          width: 1,
          color: 'blue',
          radius: 2
        }
      },
      taskList: [
        {
          taskName: '任务',
          taskId: 0,
          expireTime: '2024-5-20 05:20:00',
          taskState: true,
        },
      ],
      // 基础表单数据
      taskFormData: {
        taskName: '',
        expireTime: '',
        petId: 0,
        taskId: 0
      },
      petInfo: {
        petEname: '英文名',
        petCname: '中文名',
        petImg: '',
        petType: '默认种类',
        petAge: 4,
        petIntro: '这是宠物简介这是宠物简介这是宠物简介这是宠物简介这是宠物简介'
      },
      num: 0,
      // 向后端传输的对象
      id: {
        petId: 0
      },
      task: {
        taskId: 0
      },
      note: {
        petNote: '',
        petId: 0
      },
    }
  },

  // 计算属性传值
  computed: {
    // 计算任务状态
    taskState() {
      return function (taskState) {
        return taskState === true ? '未完成' : '已完成'
      }
    },

    // 计算到期时间
    formatTime() {
      return function (expireTime) {
        let new_date = new Date(expireTime)
        let old_date = new Date()
        let second = (new_date - old_date) / 1000
        let days = parseInt(second / 86400); // 天  24*60*60*1000 
        let hours = parseInt(second / 3600) - 24 * days;
        if (days !== 0)
          return days + '天后到期'
        else
          return hours + '小时后到期'
      }
    },
  },

  methods: {
    popUpAdd() {
      this.$refs.popup.open('bottom')
    },

    toUpdateTask(task) {
      this.taskFormData.taskName = task.taskName
      this.taskFormData.expireTime = task.expireTime
      this.taskFormData.taskId = task.taskId
      this.$refs.popUpdate.open('bottom')
    },

    updatePet() {
      uni.navigateTo({
        url: '/pages/pet/updatePet',
        success: (res) => {
          res.eventChannel.emit('addInfo', {
            // 需要传给更新页面的信息
            id: this.id.petId,
            ename: this.petInfo.petEname,
            cname: this.petInfo.petCname,
            img: this.petInfo.petImg,
            type: this.petInfo.petType,
            intro: this.petInfo.petIntro,
            age: this.petInfo.petAge
          })
        },
      })
    },

    async addTask() {
      this.taskFormData.petId = this.id.petId
      const res = await postAddPetTaskAPI(this.taskFormData)
      if (res.code === 1) {
        const task = await getPetTaskAPI(this.id)
        this.taskList = task.data;
        this.taskFormData.taskName = ''
        this.taskFormData.expireTime = ''
        this.$refs.popup.close()
      } else {
        uni.showToast({ icon: 'none', tittle: res.message })
        this.taskFormData.taskName = ''
        this.taskFormData.expireTime = ''
      }
    },
    async finishTask(taskId) {
      // 修改数据库
      this.task.taskId = taskId
      const res = await postFinishTaskAPI(this.task)
      if (res.code === 1) {
        // 修改前端
        this.taskList.forEach((task) => {
          if (task.taskId === taskId) {
            task.taskState = false
          }
        })

      } else {
        uni.showToast({ icon: 'fail', tittle: res.message })
      }
    },

    async deleteTask(taskId) {
      this.task.taskId = taskId
      const res = await postDeleteTaskAPI(this.task)
      if (res.code === 1) {
        // 修改前端
        this.taskList = this.taskList.filter((item) => item.taskId !== taskId)
      } else {
        uni.showToast({ icon: 'none', tittle: res.message })
      }
    },

    async updateTask() {
      const res = await postUpdatePetTaskAPI(this.taskFormData)
      if (res.code === 1) {
        // 修改前端
        this.taskList.forEach((task) => {
          if (task.taskId === this.taskFormData.taskId) {
            task.taskName = this.taskFormData.taskName
            task.expireTime = this.taskFormData.expireTime
          }
        })
        this.taskFormData.taskName = ''
        this.taskFormData.expireTime = ''
        this.$refs.popUpdate.close()
      } else {
        uni.showToast({ icon: 'none', tittle: res.message })
        this.taskFormData.taskName = ''
        this.taskFormData.expireTime = ''
      }
    },

    async saveNote() {
      this.note.petId = this.id.petId
      const res = await postPetNoteUpdateAPI(this.note)
      if (res.code === 1) {
        uni.showToast({
          title: '笔记更新成功',
          icon: 'success',
        })
      } else {
        this.note.petNote = ''
        uni.showToast({ icon: 'none', tittle: res.message })
      }
    },

    async showPetDetail() {
      const res = await getPetInfoAPI(this.id)
      const task = await getPetTaskAPI(this.id)
      if (res.code === 1) {
        this.petInfo.petAge = res.data.petAge
        this.petInfo.petIntro = res.data.petIntro
        this.note.petNote = res.data.petNote
        this.taskList = task.data;
      } else {
        uni.showToast({ icon: 'none', tittle: res.message })
      }
    }
  },

  //// TODO
  onShow() {
    // 接收pinia中的值
    const petInfo = usePetStore().pet
    this.id.petId = petInfo.petId
    this.petInfo.petEname = petInfo.petEname
    this.petInfo.petCname = petInfo.petCname
    this.petInfo.petImg = petInfo.petImg
    this.petInfo.petType = petInfo.petType

    this.showPetDetail()
  }
}
</script>

<style lang="scss" scoped>
// 信息
.petInfo {
  float: left;
  width: 100%;
  padding: 20rpx;
  background-color: #fff;

  .petImg {
    float: left;
    margin-right: 10rpx;
    width: 200rpx;
    height: 200rpx;
    border-radius: 20rpx;
    background-color: #d3de9a;
  }

  .cName {
    width: 225rpx;
    height: 50rpx;
    float: left;
    margin-top: 10rpx;
    font-size: 40rpx;
    font-weight: bold;
    letter-spacing: 0.1rem;
  }

  .updateBtn {
    float: right;
    margin-right: 5%;
    background-color: #54c054;
  }

  .eName {
    float: left;
    width: 48%;
    height: 30rpx;
    font-size: 30rpx;
    margin-bottom: 20rpx;
  }

  .intro {
    float: left;
    width: 68%;
    font-size: 30rpx;
    margin-bottom: 20rpx;
    font-weight: bold;
    color: #393838;
  }

  .age {
    float: right;
    width: 39%;
    height: 50rpx;
    font-size: 27rpx;
  }

  .loc {
    float: right;
    width: 34%;
    height: 50rpx;
    font-size: 27rpx;
  }
}

// 任务
.task {
  float: left;
  margin: 0 2%;
  width: 96%;
  background-color: #fff;

  .taskTittle {
    margin: 5rpx 10rpx;
    margin-bottom: 10rpx;
    font-size: 40rpx;
    font-weight: 900;
  }

  .taskCard {
    float: left;
    width: 48%;
    height: 281rpx;
    background-color: #ccc;
    margin: 8rpx;
    border-radius: 10rpx;
    overflow: hidden;

    .taskBox {
      float: left;
      width: 20%;
      height: 132rpx;
      padding: 20rpx;
      background-color: #1E6CE8;

      .taskImg {
        width: 60rpx;
        height: 60rpx;
        margin: 5rpx 0 0 5rpx;
      }

      .taskName {
        margin-left: 9rpx;
        margin-bottom: 5rpx;
        font-size: 30rpx;
        color: #fff;
      }
    }

    .time {
      float: left;
      width: 63.5%;
      height: 105rpx;
      background-color: #1F7AFF;
      padding: 35rpx 10rpx;


      .taskTime {
        font-size: 32rpx;
        color: #fffffff0;
        margin: 0 0 22rpx 5rpx;
      }

      .taskState {
        font-size: 25rpx;
        color: #ffffffd7;
        margin-left: 5rpx;
      }
    }

    .opeBox {
      float: left;
      width: 100%;
      height: 110rpx;

      .ope {
        float: left;
        height: 100%;
        width: 32.6%;
        background-color: #7e87d8;
        border-left: 1px solid #393838;

        .opeImg {
          float: left;
          width: 50rpx;
          height: 50rpx;
          margin-left: 31rpx;
          margin-top: 10rpx;
        }

        .opeTxt {
          float: left;
          margin-left: 28rpx;
          font-size: 30rpx;
          color: #fff;
        }
      }
    }
  }

  .addtask {
    float: left;
    width: 48%;
    height: 240rpx;
    background-color: #8cd48c;
    margin: 8rpx;
    border-radius: 10rpx;
    padding-top: 38rpx;

    .add {
      margin: 70rpx;
    }
  }

  .popBox {
    width: 92%;
    height: 700rpx;
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
}

// 工具
.tools {
  float: left;
  padding: 30rpx;
  padding-top: 0;

  .tittle {
    font-size: 40rpx;
    font-weight: 900;
  }

  .picture {
    float: left;
    width: 100%;

    .img {
      border: 1px solid black;
      background-color: #ccc;
    }

    .imagesBox {
      width: 100%;

      .image {
        float: left;
        width: 220rpx;
        height: 220rpx;
        border-radius: 20rpx;
        background-color: #bbd27a;
        margin-left: 12rpx;
        margin-top: 8rpx;
      }
    }
  }

  .br {
    float: left;
    background-color: #ccc;
    margin: 20rpx 2%;
    width: 96%;
    height: 1px;
  }

  .noteBox {
    float: left;

    .tips {
      float: left;
      font-size: 40rpx;
      font-weight: bold;
      margin-bottom: 7rpx;
    }

    .saveNote {
      float: right;
      height: 60rpx;
      width: 150rpx;
      color: #fff;
      font-size: 30rpx;
      margin-right: 10rpx;
      margin-top: -10rpx;
      background-color: #27BA9B;
    }

    .note {
      font-size: 35rpx;
    }
  }
}

.border {
  border: none;
}
</style>