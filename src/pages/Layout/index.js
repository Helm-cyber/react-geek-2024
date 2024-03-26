// 测试是否成功注入token
import { Layout, Menu, Popconfirm } from 'antd'
import { HomeOutlined, DiffOutlined, EditOutlined, LogoutOutlined } from '@ant-design/icons'
import './index.scss'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { clearUserInfo, fetchUserInfoService } from '@/store/modules/user'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const { Header, Sider } = Layout

const items = [
  { label: '首页', key: '/', icon: <HomeOutlined /> },
  // 点击时拿到key的属性值，即得知当前要跳到哪里去
  { label: '文章管理', key: '/article', icon: <DiffOutlined /> },
  { label: '创建文章', key: '/publish', icon: <EditOutlined /> }
]

const GeekLayout = () => {
  const navigate = useNavigate()

  const onMenuClick = (route) => { // 点击菜单时的回调函数，组件规定的默认参数是一个对象，其中有key属性
    // console.log('666', route)
    const path = route.key
    navigate(path) // 通过钩子函数跳转
  }

  // 反向高亮：1、获取当前url上的路由路径；2、找到菜单Menu负责高亮的属性selectedKeys={xx}，绑定当前的路由路径
  // 1 → 钩子函数useLocation()用于获取当前路径
  const location = useLocation()
  // console.log(location.pathname)
  const selectedKey = location.pathname

  // 触发用户个人信息的action，一进页面就触发
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchUserInfoService())
  }, [dispatch])

  // 点击"退出"时的回调函数
  const onConfirm = () => {
    dispatch(clearUserInfo()) // 清除用户信息：redux中的token、redux中的userInfo、本地的token
    navigate('/login') // 跳转到登录页
  }

  const username = useSelector(state => state.user.userInfo.name)

  return (
    <Layout>
      <Header className="header">
        <div className="logo" />
        <div className="user-info">
          <span className="user-name">{username}</span>
          <span className="user-logout">
            <Popconfirm title="是否确认退出？" okText="退出" cancelText="取消" onConfirm={onConfirm}>
              <LogoutOutlined /> 退出
            </Popconfirm>
          </span>
        </div>
      </Header>
      <Layout>
        <Sider width={200} className="site-layout-background">
          <Menu
            mode="inline"
            theme="dark"
            selectedKeys={selectedKey}
            onClick={onMenuClick}
            items={items}
            style={{ height: '100%', borderRight: 0 }}></Menu>
        </Sider>
        <Layout className="layout-content" style={{ padding: 20 }}>
          {/* 二级路由出口 */}
          <Outlet />
        </Layout>
      </Layout>
    </Layout>
  )
}
export default GeekLayout
