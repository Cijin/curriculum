t path = require('path');
  2 
  3 module.exports  = {
  4   entry: './js6/public/4/components/app.js',
  5   mode: 'development',
  6   output: {
  7     path: path.resolve(__dirname, 'js6/public/4/dist'),
  8   },
  9   module: {
 10     rules: [
 11       {
 12         test: /\.js$/,
 13         exclude: '/node_modules',
 14         loader: 'babel-loader',
 15         options: {
 16           'presets': ['@babel/preset-react']
 17         },
 18       },
 19     ],
 20   },
 21 };
