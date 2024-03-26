import { useRef, useEffect } from 'react'
import * as echarts from 'echarts'

const BarChart = ({ xData, sData, style = { width: '400px', height: '300px' } }) => {
  const chartRef = useRef(null)

  useEffect(() => { // 在useEffect()中执行，保证了DOM可用，才进行图表的渲染
    // 1、生成实例：chartRef.current获取渲染图表的DOM节点，echarts.init()初始化生成图表实例对象
    const myChart = echarts.init(chartRef.current)
    // 2、准备图表参数
    const option = {
      xAxis: {
        type: 'category',
        data: xData
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: sData,
          type: 'bar'
        }
      ]
    }
    
    // 3、使用图表的参数，完成图表的渲染
    myChart.setOption(option)
  }, [sData, xData])
  return <div ref={chartRef} style={style}></div>
}

export { BarChart }
