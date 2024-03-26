import axios from "axios"
import { getToken, removeToken } from "./token"
import router from "@/router"

const request = axios.create({
  baseURL: 'http://geek.itheima.net/v1_0',
  timeout: 5000
})

// 添加请求拦截器：请求发送之前做拦截，可以插入一些自定义的配置(参数的处理)
request.interceptors.request.use((config)=> {
  const token = getToken() // 获取到token数据
  if (token) {
    config.headers.Authorization = `Bearer ${token}` // 注入自己的token数据，按照后端要求，拼接token
  }
  return config
}, (error)=> {
  return Promise.reject(error)
})

// 添加响应拦截器：响应返回到客户端之前做拦截，重点处理返回的数据
request.interceptors.response.use((response)=> {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  return response.data
}, (error)=> {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么

  // 监控401状态码(Token失效)
  console.dir(error) // 状态码是error.response.status
  if (error.response.status === 401) {
    removeToken() // 清除本地Token
    router.navigate('/login') // 跳转到登录页
    window.location.reload() // 强制刷新页面
  }
  return Promise.reject(error)
})

export { request }
