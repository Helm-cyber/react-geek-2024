// 统一中转导出工具模块函数，以后只需import { ... } from '@/utils'
import { request } from "./request"
import { setToken, getToken, removeToken } from './token'

export { request, setToken, getToken, removeToken }
