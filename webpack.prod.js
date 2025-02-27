const path = require("path");

module.exports = {
  mode: "production",
  entry: {
    table: "./src/customVis.js",
    bell: "./src/bell.js",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      { 
        test: /\.(js|jsx)$/i, 
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react", "@babel/preset-env"],
          }
        }
      },
      { test: /\.css$/i, use: ["style-loader", "css-loader"] },
    ],
  },
  // externals: {
  //   react: "window.React",
  //   "react-dom": "window.ReactDOM",
  //   "react-table": "window.ReactTable"
  // },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      'styled-components': path.resolve(__dirname, 'node_modules', 'styled-components')
    }
  }
};
