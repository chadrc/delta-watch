const path = require('path');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

let entries = {
  'main': './index.ts'
};

let plugins = [
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: 'index.html',
    chunks: ['main']

  }),
  new MiniCssExtractPlugin({})
];

let pagesGlob = glob.sync("pages/*/");

for (let page of pagesGlob) {
  let pageName = page.replace('pages/', '').replace('/', '');
  entries[pageName] = `./pages/${pageName}/${pageName}.ts`;

  plugins.push(
    new HtmlWebpackPlugin({
      filename: `${pageName}.html`,
      template: `pages/${pageName}/${pageName}.html`,
      chunks: ['main', pageName]
    })
  )
}

module.exports = {
  mode: 'production',
  entry: entries,
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: [".ts", ".tsx", ".js"]
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader"
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      }
    ]
  },
  devServer: {
    port: 3000,
    contentBase: path.join(__dirname, 'dist')
  },
  plugins: plugins
};