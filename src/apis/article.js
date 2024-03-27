// 封装和文章相关的接口函数

import { request } from "@/utils"

// 1、获取频道列表
export function getChannelAPI () {
  return request({ url: '/channels', method: 'GET' })
}

// 2、提交文章表单
export function createArticleAPI (data) {
  return request({
    url: '/mp/articles?draft=false', // true为草稿，false为发布，暂时没有草稿状态，直接写死发布状态
    method: 'POST',
    data
  })
}

// 3、获取文章列表
export function getArticleListAPI (params) {
  return request({
    url: '/mp/articles',
    method: 'GET',
    params // 请求参数query要用params
  })
}

// 4、删除文章
export function delArticleAPI (id) {
  return request({ url: `/mp/articles/${id}`, method: 'DELETE' })
}

// 5、获取文章详情(根据文章id)
export function getArticleById (id) {
  return request({ url: `/mp/articles/${id}`, method: 'GET' })
}

// 6、更新文章
export function updateArticleAPI (data) {
  return request({ url: `/mp/articles/${data.id}?draft=false`, method: 'PUT', data })
}
