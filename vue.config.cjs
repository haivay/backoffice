module.exports = {
  pages: {
    'index': {
      entry: './src/pages/Home/main.js',
      template: 'public/index.html',
      title: 'Home',
      chunks: [ 'chunk-vendors', 'chunk-common', 'index' ]
    },
    'data': {
      entry: './src/pages/Data/main.js',
      template: 'public/data.html',
      title: 'Data',
      chunks: [ 'chunk-vendors', 'chunk-common', 'data' ]
    }
  },
  devServer: {
    proxy: {
      '/': {
        target: 'http://localhost:3000',
        changeOrigin: true
      },
      '/data': {
        target: 'http://localhost:3000/data',
        changeOrigin: true
      },
    }
  }
}