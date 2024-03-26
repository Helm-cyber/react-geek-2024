// 封装高阶组件：有token → 正常跳转；无token → 登录页

const { getToken } = require("@/utils")
const { Navigate } = require("react-router-dom")

export function AuthRoute ({ children }) { // 参数是路由组件
  const token = getToken() // 获取到token
  if (token) {
    return <>{children}</> // token存在，则正常返回路由组件
  } else {
    return <Navigate to={'/login'} replace /> // 重定向组件，replace替换模式，即不要之前的访问记录
  }
}
