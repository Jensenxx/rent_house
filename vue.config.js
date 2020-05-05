module.exports = {
  publicPath:"./",
  devServer: {
    open: true,
    host: '0.0.0.0',
    port: 9000,
    https: false,
    hotOnly: false,
    // proxy: null,
    proxy: {
      '/apibaidu': {
        target: 'http://api.map.baidu.com',
        changOrigin: true,
        pathRewrite: {
          '^/apibaidu': ''
        }
      }
    },
    before: app => { }
  },
  configureWebpack: {
    externals: {
      'BMap': 'BMap'
    }
  }
}
