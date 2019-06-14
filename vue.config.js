module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/treepc/': './',
  outputDir: 'treepc',
  devServer: {
    port: 3400,
    proxy: {
      '/api': {
        target: 'http://[::1]:3000/',
        secure: false,
        ws: true,
        changeOrigin: true,
      },
    }
  }
}