var path = require('path');

var APP_DIR = path.join(__dirname, '..', 'js');

module.exports = {
  debug: true,
  entry: "./js/app.tsx",
  output: {
    path: __dirname + "/public",
    filename: "bundle.js",
    include: APP_DIR
  },
  module: {
    preLoaders: [{
      test: /\.ts(x?)$/,
      loader: 'tslint',
      exclude: /node_modules/
    }],
    loaders: [
      {
        test: /\.ts(x?)$/,
        loaders: ['babel-loader', 'ts-loader']
      }
    ]
  }, 
  resolve: {
    extensions: ['', '.js', '.ts', '.tsx'],
    modulesDirectories: ['node_modules']
  },
  devServer: {
    port: 3000
  },
  devtool: 'source-map'
}