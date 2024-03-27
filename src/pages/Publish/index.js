import { Card, Breadcrumb, Form, Button, Radio, Input, Upload, Space, Select, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import './index.scss'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useEffect, useState } from 'react'
import { createArticleAPI, getArticleById, updateArticleAPI } from '@/apis/article'
import { useChannel } from '@/hooks/useChannel'

const { Option } = Select

const Publish = () => {
  const navigate = useNavigate()

  // 获取频道列表
  const { channelList } = useChannel()

  // 提交表单的回调函数
  const onFinish = (formValue) => {
    // console.log(formValue)

    // 校验imageType和imageList的数量是否相等，即单图对应1张，三图对应3张，不能多也不能少
    if (imageList.length !== imageType) return message.warning('封面类型和图片数量不匹配！')

    const { title, content, channel_id } = formValue

    // 根据接口文档的格式，处理收集到的表单数据
    const requestData = { // 标准的接口文档的格式
      title, // 文章标题
      content, // 文章内容
      cover: { // 文章封面
        type: imageType, // 文章封面类型，1自动，0无图，1一张，3三张
        // 这里获取到的url只是“新增文章”时的逻辑，在“编辑文章”时还需进行处理
        // 编辑文章：携带id跳回该页面，图片也获取到了，但是每张图片的对象内的属性 与 新增时的图片属性 不同了
        // 新增图片时，通过item.response.data.url获取到；而回显的图片，需要通过item.url获取到
        images: imageList.map(item => {
          if (item.response) return item.response.data.url
          else return item.url
        }) // 所有图片的链接地址
      },
      channel_id // 文章频道id
    }

    // 调用不同的接口：新增文章 → 新增文章的接口；编辑文章 → 编辑文章的接口
    // 有articleId，就是编辑状态；没有就是新增状态
    if (articleId) {
      updateArticleAPI({ ...requestData, id: articleId })
      message.success('更新文章成功！')
    } else {
      createArticleAPI(requestData)
      message.success('发布文章成功！')
    }
    navigate('/article')
  }

  // 上传图片的回调函数
  const [ imageList, setImageList ] = useState([])
  const onChange = (value) => { // value总共有三次，最后一次的对象中包含file、fileList
    // console.log('正在上传中', value)
    setImageList(value.fileList)
  }

  // 切换图片封面类型时的回调函数
  const [ imageType, setImageType] = useState(0)
  const onTypeChange = (e) => { // e.target.value就是<Radio>的value属性值
    // console.log('封面切换了', e)
    setImageType(e.target.value)
  }

  // 回填数据：页面一打开时就根据传来的id值获取对应的文章数据
  // id在路由参数上，通过useSearchParams()钩子函数，得到一个变量searchParams，它有get()方法获取参数
  const [searchParams] = useSearchParams()
  const articleId = searchParams.get('id')
  // console.log(articleId)

  // 获取Form组件的实例对象：Form组件有固定方法Form.useForm()，返回一个数组，解构出form，将form绑定到Form组件上
  const [form] = Form.useForm()

  useEffect(() => {
    // 1、通过id获取文章数据
    async function getArticleDetail () {
      const res = await getArticleById(articleId)
      const data = res.data
      const { cover } = data
      // 2、调用Form组件实例的方法setFieldsValue()，完成回填
      // form.setFieldsValue(res.data)
      form.setFieldsValue({
        ...data,
        type: cover.type
      })

      // 目前写法无法回显文章封面图片，因为是数据结构的问题
      // setFieldsValue()方法，要求传入的是{ type: 0或1或3 }，而现在给的res.data中是{ cover: { type: 3 } }
      // 解决：改写传入的参数，变为一个对象，先展开...res.data，再单独设置type值是res.data.cover.type

      // 回显图片列表
      setImageType(cover.type) // 先让静态结构显示出来
      // 显示图片，后端要求的格式是：每一个图片都是一个对象，其中有url属性，因此通过map()方法处理数据
      setImageList(cover.images.map(url => { return { url } }))
    }
    // 只有存在articleId时，才调用该函数，否则"新增文章"时也会调用
    if (articleId) getArticleDetail()
  }, [articleId, form])

  return (
    <div className="publish">
      <Card
        title={
          <Breadcrumb items={[
            { title: <Link to={'/'}>首页</Link> },
            { title: `${articleId ? '编辑' : '新增'}文章` },
          ]}
          />
        }
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          // 控制整个表单域的初始值，这里的type对应下面的<Form.Item name="type">，最好为0，和state中对应，即无图模式
          initialValues={{ type: 0 }}
          // 当表单的所有项目都通过校验时，点击提交按钮，自动触发onFinish回调函数
          onFinish={onFinish}
          form={form} // 绑定实例对象
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

          <Form.Item label="封面">
            <Form.Item name="type">
              <Radio.Group onChange={onTypeChange}>
                <Radio value={1}>单图</Radio>
                <Radio value={3}>三图</Radio>
                <Radio value={0}>无图</Radio>
              </Radio.Group>
            </Form.Item>
            {
              imageType > 0 && 
              <Upload
                // listType决定选择文件框的外观样式，showUploadList控制显示的上传列表
                // 接口请求参数中叫image，这里name就叫image
                listType="picture-card"
                showUploadList
                action={'http://geek.itheima.net/v1_0/upload'}
                name='image'
                onChange={onChange}
                // 通过maxCount属性，限制上传数量，当为1时，始终用最新上传的代替当前的
                maxCount={imageType}
                fileList={imageList} // 回显数据：当前要显示的图片列表
              >
                <div style={{ marginTop: 8 }}>
                  <PlusOutlined />
                </div>
              </Upload>
            }
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
