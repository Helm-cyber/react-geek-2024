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
