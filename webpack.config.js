const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, './dist'),
    filename: 'bundle.js',
  },
  devServer: {
    contentBase: path.join(__dirname, './dist'),
    port: 9000,
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: './public', to: '.' },
    ]),
  ],
};
