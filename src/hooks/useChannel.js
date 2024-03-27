// 封装获取频道列表的逻辑
import { getChannelAPI } from "@/apis/article"
import { useEffect, useState } from "react"

function useChannel () {
  // 1、获取频道列表的逻辑
  // 获取频道列表
  const [ channelList, setChannelList ] = useState([])

  useEffect(() => {
    // 封装函数，在函数体内，调用接口
    const getChannelList = async () => {
      const res = await getChannelAPI()
      setChannelList(res.data.channels)
    }
    // 调用该函数
    getChannelList()
  }, [])

  // 2、return组件中要用到的数据
  return {channelList} // 数组形式、对象形式、直接数据形式都可以，只是对象形式利于解构赋值
}

export { useChannel }
