import './index.scss'
import { Card, Form, Input, Button, message } from 'antd'
import logo from '@/assets/logo.png'
import { fetchLoginService } from '@/store/modules/user'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate() // 跳转函数

  const onFinish = async (values) => {
    console.log(values)
    // 触发异步action，还是用dispatch，但需要先通过useDispatch()获得dispatch方法
    await dispatch(fetchLoginService(values)) // 传入用户输入的表单数据
    navigate('/') // 跳转到首页(因为有await，保证了异步操作必须成功后才会跳转首页)
    message.success('登录成功')
  }

  return (
    <div className="login">
      <Card className="login-container">
        <img className="login-logo" src={logo} alt="" />
        {/* 登录表单 */}
        {/* validateTrigger属性：统一设置字段触发验证的时机，这里统一设置为失焦时触发验证 */}
        {/* onFinish回调函数：通过回调函数的参数，获取用户输入的内容 */}
        <Form validateTrigger="onBlur" onFinish={onFinish}>
          <Form.Item
            name="mobile"
            // 多条校验逻辑时，从上到下依次校验，当上面的不通过时，就不会往后校验
            rules={[
              { required: true, message: '请输入手机号！' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式！' }
            ]}
          >
            <Input size="large" placeholder="请输入手机号" />
          </Form.Item>
          <Form.Item
            name="code"
            rules={[
              { required: true, message: '请输入验证码！' }
            ]}
          >
            <Input size="large" placeholder="请输入验证码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default Login
