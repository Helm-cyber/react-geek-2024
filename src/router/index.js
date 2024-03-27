import Layout from '@/pages/Layout'
import Login from '@/pages/Login'
import { createBrowserRouter } from 'react-router-dom'
import { AuthRoute } from '@/components/AuthRoute'
// import Home from '@/pages/Home'
// import Article from '@/pages/Article'
// import Publish from '@/pages/Publish'
import { Suspense, lazy } from 'react'

// 路由懒加载：1、借助lazy()函数，动态导入组件
const Home = lazy(() => import('@/pages/Home'))
const Article = lazy(() => import('@/pages/Article'))
const Publish = lazy(() => import('@/pages/Publish'))

// 配置路由实例
const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthRoute><Layout /></AuthRoute>,
    children: [ // 二级路由配置
      // 路由懒加载：2、使用Suspense组件，包裹element
      // fallback属性用于提供占位，即渲染完毕之前，默认显示什么(因为现在的路由是异步渲染)
      { index: true, element: <Suspense fallback={'加载中...'}><Home /></Suspense> },
      { path: 'article', element: <Suspense fallback={'加载中...'}><Article /></Suspense> },
      { path: 'publish', element: <Suspense fallback={'加载中...'}><Publish /></Suspense> }
    ]
  },
  {
    path: '/login',
    element: <Login />
  }
])

export default router
