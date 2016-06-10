module.exports = {
  entry: "./js/app.tsx",
  output: {
    path: __dirname + "/public",
    filename: "bundle.js"
  },
  module: {
    loaders: [
      { 
        test: /\.ts(x?)$/, 
        loader: 'ts-loader'
      }
    ]
  }
}