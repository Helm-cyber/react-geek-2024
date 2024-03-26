// 测试是否成功注入token
import { request } from "@/utils"
import { useEffect } from "react"

const Layout = () => {
  useEffect(() => {
    request.get('/user/profile') // 获取用户个人信息
  }, [])

  return (
    <div>This is Layout Page</div>
  )
}

export default Layout
