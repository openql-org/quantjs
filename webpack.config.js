module.exports = {
  module: {
    rules: [{
      test: /\.css$/,
      use: [
        { loader: 'style-loader' },
        { loader: 'css-loader' }
      ]
    }]
  },
  entry: './index',
  output: {
    libraryTarget: 'umd',
    path: __dirname + '/dist',
    filename: 'q-face.js',
  },
};
