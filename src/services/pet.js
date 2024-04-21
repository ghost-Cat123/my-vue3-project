import { http } from '@/utils/http'

// contentType: 'application/x-www-form-urlencoded',
// contentType: 'application/json',

/** 
 * 1. 获取动物列表信息
*/
export const getPetListAPI = () => {
  return http({
    method: 'GET',
    contentType: 'application/json',
    url: '/pet/petList'
  })
}

/** 
 * 2. 删除动物信息
*/
export const postPetDeleteAPI = (data) => {
  return http({
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded',
    url: '/pet/petDelete',
    data
  })
}

/** 
 * 3. 新增动物信息
*/
export const postPetAddAPI = (data) => {
  return http({
    method: 'POST',
    contentType: 'application/json',
    url: '/pet/petAdd',
    data
  })
}

/** 
 * 4. 查询动物详细信息
 */
export const getPetInfoAPI = (data) => {
  return http({
    method: 'GET',
    contentType: 'application/json',
    url: '/pet/petInfo',
    data
  })
}

/** 
 * 5. 修改动物笔记
 */
export const postPetNoteUpdateAPI = (data) => {
  return http({
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded',
    url: '/pet/petNoteUpdate',
    data
  })
}

/** 
 * 6. 修改动物信息
 */
export const postPetInfoUpdateAPI = (data) => {
  return http({
    method: 'POST',
    contentType: 'application/json',
    url: '/pet/petInfoUpdate',
    data
  })
}

// 任务接口
/** 
 * 7. 添加任务
 */
export const postAddPetTaskAPI = (data) => {
  return http({
    method: 'POST',
    contentType: 'application/json',
    url: '/pet/addPetTask',
    data
  })
}

/** 
 * 8. 查询任务
 */
export const getPetTaskAPI = (data) => {
  return http({
    method: 'GET',
    contentType: 'application/x-www-form-urlencoded',
    url: '/pet/petTaskInfo',
    data
  })
}

/** 
 * 9. 更新任务
 */
export const postUpdatePetTaskAPI = (data) => {
  return http({
    method: 'POST',
    contentType: 'application/json',
    url: '/pet/updatePetTask',
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
    url: '/pet/deleteTask',
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
    url: '/pet/finishTask',
    data
  })
}