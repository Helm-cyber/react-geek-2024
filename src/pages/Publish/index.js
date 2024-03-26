import { Card, Breadcrumb, Form, Button, Radio, Input, Upload, Space, Select } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import './index.scss'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useEffect, useState } from 'react'
import { getChannelAPI, createArticleAPI } from '@/apis/article'

const { Option } = Select

const Publish = () => {
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

  // 提交表单的回调函数
  const onFinish = (formValue) => {
    console.log(formValue)
    const { title, content, channel_id } = formValue

    // 根据接口文档的格式，处理收集到的表单数据
    const requestData = { // 标准的接口文档的格式
      title, // 文章标题
      content, // 文章内容
      cover: { // 文章封面
        type: 0, // 文章封面类型，1自动，0无图，1一张，3三张
        images: [] // 所有图片的链接地址
      },
      channel_id // 文章频道id
    }

    // 调用接口提交
    createArticleAPI(requestData)
  }

  return (
    <div className="publish">
      <Card
        title={
          <Breadcrumb items={[
            { title: <Link to={'/'}>首页</Link> },
            { title: '发布文章' },
          ]}
          />
        }
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ type: 1 }}
          // 当表单的所有项目都通过校验时，点击提交按钮，自动触发onFinish回调函数
          onFinish={onFinish}
        >
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: '请输入文章标题' }]}
          >
            <Input placeholder="请输入文章标题" style={{ width: 400 }} />
          </Form.Item>
          <Form.Item
            label="频道"
            name="channel_id"
            rules={[{ required: true, message: '请选择文章频道' }]}
          >
            <Select placeholder="请选择文章频道" style={{ width: 400 }}>
              {/* 遍历列表：数组.map(item => 返回的结构) */}
              {/* 这里的value属性：用户选中后，组件会自动收集起来，作为接口的提交字段 */}
              {channelList.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item
            label="内容"
            name="content"
            rules={[{ required: true, message: '请输入文章内容' }]}
          >
            {/* 富文本编辑器 */}
            <ReactQuill className="publish-quill" theme="snow" placeholder="请输入文本内容" />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 4 }}>
            <Space>
              <Button size="large" type="primary" htmlType="submit">
                发布文章
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default Publish
