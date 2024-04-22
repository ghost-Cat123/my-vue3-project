import { http } from '@/utils/http'

// contentType: 'application/x-www-form-urlencoded',
// contentType: 'application/json',

/** 
 * 1. 获取植物列表信息
*/
export const getPlantListAPI = () => {
  return http({
    method: 'GET',
    contentType: 'application/json',
    url: '/plant/plantList'
  })
}

/** 
 * 2. 删除植物信息
*/
export const postPlantDeleteAPI = (data) => {
  return http({
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded',
    url: '/plant/plantDelete',
    data
  })
}

/** 
 * 3. 新增植物信息
*/
export const postPlantAddAPI = (data) => {
  return http({
    method: 'POST',
    contentType: 'application/json',
    url: '/plant/plantAdd',
    data
  })
}

/** 
 * 4. 查询植物详细信息
 */
export const getPlantInfoAPI = (data) => {
  return http({
    method: 'GET',
    contentType: 'application/json',
    url: '/plant/plantInfo',
    data
  })
}

/** 
 * 查询未完成的植物任务数
 */
// export const getUnfinishedTaskAPI = (data) => {
//   return http({
//     method: 'GET',
//     contentType: 'application/x-www-form-urlencoded',
//     url: '/plant/unfinishedTask',
//     data
//   })
// }

/** 
 * 5. 修改植物笔记
 */
export const postPlantNoteUpdateAPI = (data) => {
  return http({
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded',
    url: '/plant/plantNoteUpdate',
    data
  })
}

/** 
 * 6. 修改植物信息
 */
export const postPlantInfoUpdateAPI = (data) => {
  return http({
    method: 'POST',
    contentType: 'application/json',
    url: '/plant/plantInfoUpdate',
    data
  })
}

// 任务接口
/** 
 * 7. 添加任务
 */
export const postAddPlantTaskAPI = (data) => {
  return http({
    method: 'POST',
    contentType: 'application/json',
    url: '/plant/addPlantTask',
    data
  })
}

/** 
 * 8. 查询任务
 */
export const getPlantTaskAPI = (data) => {
  return http({
    method: 'GET',
    contentType: 'application/x-www-form-urlencoded',
    url: '/plant/plantTaskInfo',
    data
  })
}

/** 
 * 9. 更新任务
 */
export const postUpdatePlantTaskAPI = (data) => {
  return http({
    method: 'POST',
    contentType: 'application/json',
    url: '/plant/updatePlantTask',
    data
  })
}

/** 
 * 10. 删除任务
 */
export const postDeleteTaskAPI = (data) => {
  return http({
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded',
    url: '/plant/deleteTask',
    data
  })
}

/** 
 * 11. 完成任务
 */
export const postFinishTaskAPI = (data) => {
  return http({
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded',
    url: '/plant/finishTask',
    data
  })
}