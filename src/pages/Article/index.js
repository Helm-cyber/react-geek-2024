import { Link } from 'react-router-dom'
import { Card, Breadcrumb, Form, Button, Radio, DatePicker, Select } from 'antd'
import locale from 'antd/es/date-picker/locale/zh_CN' // 引入汉化包，显示中文
import { Table, Tag, Space } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import img404 from '@/assets/error.png'
import { useChannel } from '@/hooks/useChannel'
import { useEffect, useState } from 'react'
import { getArticleListAPI } from '@/apis/article'

const { Option } = Select
const { RangePicker } = DatePicker

const Article = () => {
  const { channelList } = useChannel() // 获取频道列表数据

  // 定义枚举状态
  const statusList = {
    1: <Tag color='warning'>待审核</Tag>,
    2: <Tag color='success'>审核通过</Tag>
  }

  // 准备列数据
  const columns = [
    {
      title: '封面',
      dataIndex: 'cover',
      width: 120,
      render: cover => {
        return <img src={cover.images[0] || img404} width={80} height={60} alt="" />
      }
    },
    {
      title: '标题',
      dataIndex: 'title',
      width: 220
    },
    {
      title: '状态',
      dataIndex: 'status',
      // data就是后端返回的状态status，可以根据它做条件渲染
      // 0-草稿，1-待审核，2-审核通过，3-审核失败，目前后端只支持1和2
      render: data => statusList[data]
    },
    {
      title: '发布时间',
      dataIndex: 'pubdate'
    },
    {
      title: '阅读数',
      dataIndex: 'read_count'
    },
    {
      title: '评论数',
      dataIndex: 'comment_count'
    },
    {
      title: '点赞数',
      dataIndex: 'like_count'
    },
    {
      title: '操作',
      render: data => {
        return (
          <Space size="middle">
            <Button type="primary" shape="circle" icon={<EditOutlined />} />
            <Button
              type="primary"
              danger
              shape="circle"
              icon={<DeleteOutlined />}
            />
          </Space>
        )
      }
    }
  ]

  // 准备表格body数据
  const data = [
    {
      id: '8218',
      comment_count: 0,
      cover: {
        images: [],
      },
      like_count: 0,
      pubdate: '2019-03-11 09:00:00',
      read_count: 2,
      status: 2,
      title: 'wkwebview离线化加载h5资源解决方案'
    }
  ]

  // 筛选功能：1、按照接口文档，准备参数
  const [requestData, setRequestData] = useState({
    status: '', // 文章状态
    channel_id: '', // 频道id
    begin_pubdate: '', // 起始时间
    end_pubdate: '', // 截止时间
    page: 1, // 当前页码(默认为1)
    per_page: 4 // 当前页条数(默认为10)
  })

  // 获取文章列表
  const [ articleList, setArticleList ] = useState([])
  const [ count, setCount ] = useState(0)
  useEffect(() => {
    async function getArticleList () {
      const res = await getArticleListAPI(requestData)
      setArticleList(res.data.results)
      setCount(res.data.total_count)
    }
    getArticleList()
  }, [requestData])

  // 筛选功能：2、获取当前的筛选数据(表单验证通过时的回调函数)
  const onFinish = (formValue) => {
    // 筛选功能：3、把表单的数据放到请求参数中
    setRequestData({ // 修改对象类型的数据时，不能直接修改内部数据，先解构出所有数据，再补充属性
      ...requestData,
      channel_id: formValue.channel_id,
      status: formValue.status,
      begin_pubdate: formValue.date[0].format('YYYY-MM-DD'), // 收集到的格式是antD格式，自带有format()方法
      end_pubdate: formValue.date[1].format('YYYY-MM-DD')
    })
    // 筛选功能：4、重新拉取文章列表，并渲染table(该逻辑是重复的，需要复用)
    // 这里不再需要写代码，因为requestData变化时，会重复执行副作用函数，看上面的useEffect()和它的依赖项
  }

  return (
    <div>
      <Card
        title={
          <Breadcrumb items={[
            { title: <Link to={'/'}>首页</Link> },
            { title: '文章列表' },
          ]} />
        }
        style={{ marginBottom: 20 }}
      >
        <Form initialValues={{ status: '' }} onFinish={onFinish}>
          <Form.Item label="状态" name="status">
            <Radio.Group>
              <Radio value={''}>全部</Radio>
              <Radio value={0}>草稿</Radio>
              <Radio value={2}>审核通过</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="频道" name="channel_id">
            <Select
              placeholder="请选择文章频道"
              defaultValue="lucy"
              style={{ width: 120 }}
            >
              {channelList.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}
            </Select>
          </Form.Item>

          <Form.Item label="日期" name="date">
            {/* 传入locale属性 控制中文显示*/}
            <RangePicker locale={locale}></RangePicker>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginLeft: 40 }}>
              筛选
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* 表格区域 */}
      <Card title={`根据筛选条件共查询到 ${count} 条结果：`}>
        <Table rowKey="id" columns={columns} dataSource={articleList} />
      </Card>
    </div>
  )
}

export default Article
