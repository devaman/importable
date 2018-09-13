const path = require('path');
const webpack = require('webpack');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = (env, options) => {
  const { analyze } = options;

  const entry = path.resolve(__dirname, 'src/index.js');

  const exclude = [/node_modules/];

  const buildPath = path.resolve(__dirname, 'build/');

  return {
    entry,
    module: {
      rules: [
        {
          test: /\.(js)$/,
          exclude,
          use: ['babel-loader', 'eslint-loader'],
        },
      ],
    },
    resolve: { extensions: ['*', '.js'] },
    output: {
      filename: 'index.js',
      path: buildPath,
      library: 'importable',
      libraryTarget: 'umd',
    },
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          sourceMap: true,
        }),
      ],
    },
    plugins: [
      new webpack.HashedModuleIdsPlugin(),
      new webpack.SourceMapDevToolPlugin({
        filename: 'index.js.map',
      }),
      new CleanWebpackPlugin(['build']),
      ...(analyze ? [new BundleAnalyzerPlugin()] : []),
    ],
  };
};
