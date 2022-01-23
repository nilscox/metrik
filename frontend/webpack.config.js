/* eslint-disable */

const path = require('path');
const { EnvironmentPlugin, HotModuleReplacementPlugin, ProvidePlugin } = require('webpack');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const { NODE_ENV = 'development', HOST = '0.0.0.0', PORT = '8000' } = process.env;

/** @type {import('webpack').Configuration} */
const config = (module.exports = {
  mode: 'development',
  devtool: 'source-map',

  entry: './src/index.tsx',

  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },

  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },

  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        loader: 'esbuild-loader',
        options: {
          loader: 'tsx',
          target: 'es6',
        },
      },
    ],
  },

  plugins: [
    new EnvironmentPlugin({
      API_URL: 'http://localhost:3000',
      TOKEN: null,
    }),
    new ProvidePlugin({ React: 'react' }),
    new HtmlWebpackPlugin(),
  ],
});

if (NODE_ENV === 'development') {
  config.plugins.push(new ReactRefreshWebpackPlugin());

  /** @type {import('webpack-dev-server').Configuration} */
  config.devServer = {
    host: HOST,
    port: Number(PORT),
    historyApiFallback: true,
  };
}

if (NODE_ENV === 'production') {
  config.mode = 'production';
}
