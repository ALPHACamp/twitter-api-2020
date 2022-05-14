const path = require('path')

module.exports = {
  outputDir: path.resolve(__dirname, './app'),
  configureWebpack: {
    plugins: [],
    resolve: {
      symlinks: false
    }
  },
  devServer: {
    // https://cli.vuejs.org/config/#devserver-proxy //https://cli.vuejs.org/guide/webpack.html#simple-configuration
    host: 'localhost',
    port: 8080,
    proxy: {
      '!/': {
        // don't proxy root
        target: 'http://localhost:3000/',
        ws: false,
        secure: false
      },
      '/*': {
        // proxy everything else
        target: 'http://localhost:3000/',
        ws: false,
        secure: false
      }
    }
  }
}
