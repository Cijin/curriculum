const path = require('path');

module.exports  = {
  entry: './components/app.js',
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: 'babel-loader',
        options: {
          'presets': ['@babel/preset-react']
        },
      },
    ],
  },
};