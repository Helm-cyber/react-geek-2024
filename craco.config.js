// 扩展WebPack配置
const path = require('path')

module.exports = {
  webpack: { // webpack配置
    alias: { // 配置别名
      '@': path.resolve(__dirname, 'src') // 约定使用 @ 表示src文件所在路径
    }
  }
}
