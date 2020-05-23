'use strict';

const path = require('path');

const base = {
  mode: 'production',
  target: 'node',
  entry: path.resolve(__dirname, './src/index.js'),
  module: {
    rules: [],
  },
};

function getLoader() {
  return {
    module: {
      rules: [
        {
          test: /\.js$/,
          enforce: 'pre',
          use: {
            loader: path.resolve(__dirname, '../../../src/index.ts'),
            options: {},
          },
          include: /node_modules/,
        },
      ],
    },
  };
}

module.exports = {
  base,
  getLoader,
};
