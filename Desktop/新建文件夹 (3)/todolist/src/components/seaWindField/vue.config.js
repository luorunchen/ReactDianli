module.exports = {
  // 解决打包后静态文件路径问题
  // publicPath: './',
  lintOnSave: false,
  publicPath: './',
  outputDir: 'dist',
  assetsDir: 'static',
  productionSourceMap: false,
  // 开发环境配置
  devServer: {
    // compress: true,
    // 默认打开端口
    port: 3000,
    // 是否直接打开
    open: true,
    // 是否热更新
    hot: true,
    // 解决开发环境跨域问题
    proxy: {
      '/api': {
        target: 'http://localhost:5500/src/assets', // 代理地址，这里设置的地址会代替axios中设置的baseURL
        // target: 'http://localhost:8080/',//代理地址，这里设置的地址会代替axios中设置的baseURL
        changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
        // ws: true, // proxy websockets
        // pathRewrite方法重写url
        pathRewrite: {
          '^/api': '/'
          // pathRewrite: {'^/api': '/'} 重写之后url为 http://192.168.1.16:8085/xxxx
          // pathRewrite: {'^/api': '/api'} 重写之后url为 http://192.168.1.16:8085/api/xxxx
        }
      }
    }

  }

}
