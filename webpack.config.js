const path = require('path');

module.exports = {
  entry: './js6/public/7/components/app.js',
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'js6/public/7/dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: '/node_modules',
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-react'],
        },
      },
    ],
  },
};
