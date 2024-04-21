import { http } from '@/utils/http'

// contentType: 'application/x-www-form-urlencoded',
// contentType: 'application/json',

/** 
 * 1. 获取评论列表信息
*/

export const getFindCommentByLikeAPI = (data) => {
  return http({
    method: 'GET',
    contentType: 'application/x-www-form-urlencoded',
    url: '/comment/findCommentByLike',
    data
  })
}

/** 
 * 2. 获取评论列表信息
*/
export const getFindCommentByTimeAPI = (data) => {
  return http({
    method: 'GET',
    contentType: 'application/x-www-form-urlencoded',
    url: '/comment/findCommentByTime',
    data
  })
}

/** 
 * 3. 查询是否点过赞
*/
export const postIsLikeCommentAPI = (data) => {
  return http({
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded',
    url: '/comment/isLikeComment',
    data
  })
}

/** 
 * 4. 评论点赞
*/
export const postLikeCommentAPI = (data) => {
  return http({
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded',
    url: '/comment/likeComment',
    data
  })
}

/** 
 * 5. 取消评论点赞
*/
export const postDislikeCommentAPI = (data) => {
  return http({
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded',
    url: '/comment/dislikeComment',
    data
  })
}


/** 
 * 6. 用户发表评论
*/
export const postAddCommentAPI = (data) => {
  return http({
    method: 'POST',
    contentType: 'application/json',
    url: '/comment/addComment',
    data
  })
}

