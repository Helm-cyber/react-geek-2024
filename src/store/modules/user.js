// 与用户相关的状态管理

import { removeToken, request } from "@/utils"
import { createSlice } from "@reduxjs/toolkit"
import { setToken as _setToken, getToken } from '@/utils'
import { loginAPI, getProfileAPI } from "@/apis/user"

const userStore = createSlice({
  name: 'user',
  initialState: { // 初始化状态变量
    // token: localStorage.getItem('token_key') || '' // 能取到就用本地的，取不到就用空串，重新获取token
    token: getToken() || '', // 优化后的代码
    userInfo: {} // 个人信息
  },
  reducers: { // 设置同步的修改方法
    setToken (state, action) {
      state.token = action.payload
      // localStorage.setItem('token_key', action.payload) // localStorage存一份
      _setToken(action.payload) // 优化后的代码
    },
    setUserInfo (state, action) {
      state.userInfo = action.payload
    },
    clearUserInfo (state) {
      state.token = '' // 置空redux中的token
      state.userInfo = {} // 置空用户信息
      removeToken() // 清除本地的token
    }
  }
})

// 解构出actionCreater
const { setToken, setUserInfo, clearUserInfo } = userStore.actions

// 获取reducer函数
const userReducer = userStore.reducer

// 异步方法：1、登录时获取token，传来用户填写的表单数据
const fetchLoginService = (loginForm) => {
  return async (dispatch) => {
    const res = await loginAPI(loginForm)
    dispatch(setToken(res.data.token)) // 传入actionCreater，生成action对象，并传入后端返回的数据，设置状态变量的值
  }
}

// 异步方法：2、获取用户个人信息
const fetchUserInfoService = () => {
  return async (dispatch) => {
    const res = await getProfileAPI() // 请求头携带token，已经在请求拦截器携带了
    dispatch(setUserInfo(res.data))
  }
}

export { setToken, fetchLoginService, fetchUserInfoService, clearUserInfo }
export default userReducer
