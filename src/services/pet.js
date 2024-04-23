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

// 图片接口
/** 
 * 7. 获取该动物所有图片
 */
export const getFindPetImgs = (data) => {
  return http({
    method: 'GET',
    contentType: 'application/x-www-form-urlencoded',
    url: '/pet/findPetImgs',
    data
  })
}

/** 
 * 8. 添加图片
 */
export const postAddPetImgs = (data) => {
  return http({
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded',
    url: '/pet/addPetImgs',
    data
  })
}

/** 
 * 9. 删除图片
 */
export const postDeletePetImgs = (data) => {
  return http({
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded',
    url: '/pet/deletePetImgs',
    data
  })
}


// 任务接口
/** 
 * 10. 添加任务
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
 * 11. 查询任务
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
 * 12. 更新任务
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
 * 13. 删除任务
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
 * 14. 完成任务
 */
export const postFinishTaskAPI = (data) => {
  return http({
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded',
    url: '/pet/finishTask',
    data
  })
}