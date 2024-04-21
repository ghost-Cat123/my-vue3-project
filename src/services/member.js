import { http } from '@/utils/http'

/**
 * 1. 传统登录-用户名+密码
 * @param data 请求参数
 */
export const postLoginAPI = (data) => {
  return http({
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded',
    url: '/member/login',
    data
  })
}

/**
 * 2. 注册
 * @param data 请求参数
 */
export const postRegisterAPI = (data) => {
  return http({
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded',
    url: '/member/register',
    data
  })
}

/**
 * 3. 根据用户名获取用户信息 
 */
export const getMemberInfoAPI = () => {
  return http({
    method: 'GET',
    contentType: 'application/x-www-form-urlencoded',
    url: '/member/memberInfo'
  })
}

/**
 * 4. 修改用户密码 
 */
export const patchUpdatePwdAPI = (data) => {
  return http({
    method: 'PATCH',
    contentType: 'application/json',
    url: '/member/updatePwd',
    data
  })
}

/** 
 * 5. 更新用户信息
 */
export const postUpdateMemberAPI = (data) => {
  return http({
    method: 'PUT',
    contentType: 'application/json',
    url: '/member/memberUpdate',
    data
  })
}