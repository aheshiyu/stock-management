const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  publicPath: isProd ? '/stock-management' : '/',
  outputDir: 'docs',
  filenameHashing: false,
  productionSourceMap: false,
  devServer: {
    port: 8888,
  }
}
