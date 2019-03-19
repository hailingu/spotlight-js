const path = require('path');
const outputDir = path.resolve(__dirname, 'dist');
module.exports = {
  entry: path.resolve(__dirname, 'src/index.js'),
  output: {
    path: outputDir,
    filename: 'spotlight.js'
  },
  mode: 'development',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                targets: {
                  browsers: ['> 1%', 'last 2 versions']
                }
              }]
            ]
          }
        },
        exclude: '/node_modules/'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      }
    ]
  }
};
