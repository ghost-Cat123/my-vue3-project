import { http } from '@/utils/http'

// contentType: 'application/x-www-form-urlencoded',
// contentType: 'application/json',

/** 
 * 1. 获取用户发帖列表信息按点赞数排序
*/
export const getFindAllByLikeAPI = () => {
  return http({
    method: 'GET',
    contentType: 'application/json',
    url: '/post/findAllByLike'
  })
}

/** 
 * 2. 获取用户发帖列表信息按修改时间排序
*/
export const getFindAllByTimeAPI = () => {
  return http({
    method: 'GET',
    contentType: 'application/json',
    url: '/post/findAllByTime'
  })
}

/** 
 * 3. 模糊查询
*/
export const postFuzzyQueryAPI = (data) => {
  return http({
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded',
    url: '/post/fuzzyQuery',
    data
  })
}

/** 
 * 4. 用户发帖
*/
export const postSendPostAPI = (data) => {
  return http({
    method: 'POST',
    contentType: 'application/json',
    url: '/post/sendPost',
    data
  })
}

/** 
 * 5. 根据用户id查询用户发帖详细信息
*/
export const getFindPostById = (data) => {
  return http({
    method: 'GET',
    contentType: 'application/x-www-form-urlencoded',
    url: '/post/findPostById',
    data
  })
}

/** 
 * 6. 查询是否点过赞
*/
export const postIsLikePostAPI = (data) => {
  return http({
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded',
    url: '/post/isLikePost',
    data
  })
}

/** 
 * 7. 点赞帖子
*/
export const postLikePostAPI = (data) => {
  return http({
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded',
    url: '/post/likePost',
    data
  })
}

/** 
 * 8. 取消帖子点赞
*/
export const postDislikePostAPI = (data) => {
  return http({
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded',
    url: '/post/dislikePost',
    data
  })
}

/** 
 * 9. 根据用户id查询该用户所有发的帖子
*/
export const getFindByMemberIdAPI = (data) => {
  return http({
    method: 'GET',
    contentType: 'application/x-www-form-urlencoded',
    url: '/post/findByMemberId',
    data
  })
}

/** 
 * 10. 用户删除帖子
*/
export const postDeletePostAPI = (data) => {
  return http({
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded',
    url: '/post/dislikePost',
    data
  })
}

/** 
 * 11. 用户编辑帖子
*/
export const postEditPostAPI = (data) => {
  return http({
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded',
    url: '/post/editPost',
    data
  })
}
