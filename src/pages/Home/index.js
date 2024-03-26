import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'

const Home = () => {
  const chartRef = useRef(null)

  useEffect(() => { // 在useEffect()中执行，保证了DOM可用，才进行图表的渲染
    // 1、生成实例：chartRef.current获取渲染图表的DOM节点，echarts.init()初始化生成图表实例对象
    const myChart = echarts.init(chartRef.current)

    // 2、准备图表参数
    const option = {
      xAxis: {
        type: 'category',
        data: ['Vue', 'React', 'Angular']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [10, 40, 70],
          type: 'bar'
        }
      ]
    }
    // 3、使用图表的参数，完成图表的渲染
    myChart.setOption(option)
  }, [])

  return (
    <div>
      <div ref={chartRef} style={{ width: '500px', height: '400px' }} />
    </div >
  )
}

export default Home
