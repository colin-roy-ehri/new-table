const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    table: "./src/customVis.js",
    bell: "./src/bell.js",
  },
  devServer: {
    static: "./dist",
    https: true,
    port: 8080,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    }
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        use: "babel-loader",
        exclude: /node_modules/,
        include: /src/,
        sideEffects: false,
      },
      { test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },

    ],
  },
  resolve: {
    extensions: [".jsx", ".js", ".css"],
    fallback: { buffer: false },
  },
  devtool: "source-map",
};
