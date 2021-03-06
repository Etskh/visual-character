const path = require('path');

module.exports = {
  // TICKET: put this into webpack.dev.js (https://webpack.js.org/guides/production/)
  // https://github.com/Etskh/visual-character/issues/39
  devtool: 'inline-source-map',
  entry: './src/client/app.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public'),
  },
  resolve: {
    extensions: [".js", ".json", ".jsx"],
  },
  module: {
    rules: [
      {
        test: { or: [ /.js$/, /.jsx$/ ]},
        include: [
          path.resolve(__dirname, 'src/client'),
          path.resolve(__dirname, 'src'),
        ],
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            },
          },
        ],
      },
    ],
  },
};
