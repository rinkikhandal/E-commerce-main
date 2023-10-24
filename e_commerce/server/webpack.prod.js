const path = require("path");
const NodemonPlugin = require("nodemon-webpack-plugin");

module.exports = {
  resolve: {
    extensions: [".js", ".jsx"],
    fallback: {
      "mongodb-client-encryption": false,
      aws4: false,
      snappy: false,
      "@mongodb-js/zstd": false,
      kerberos: false,
      "@aws-sdk/credential-providers": false,
      "mock-aws-s3": false,
      nock: false,
      "aws-sdk": false,
      esbuild: false,
      "@swc/core": false,
      "uglify-js": false,
    },
  },
  entry: "./server.js",
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, "dist2"),
  },
  target: "node",
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/,
      },
    ],
  },
  devtool: "source-map",
  plugins: [new NodemonPlugin()],
};
