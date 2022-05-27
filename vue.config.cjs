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
      template: 'public/index.html',
      title: 'Data',
      chunks: [ 'chunk-vendors', 'chunk-common', 'data' ]
    },
    'form': {
      entry: './src/pages/Form/main.js',
      template: 'public/index.html',
      title: 'Form',
      chunks: [ 'chunk-vendors', 'chunk-common', 'form' ]
    }
  },
  devServer: {
    proxy: 'http://localhost:3000'
  }
}