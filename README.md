# downpile-node-modules-webpack-loader

[![npm](https://img.shields.io/npm/v/downpile-node-modules-webpack-loader.svg?style=flat-square)](https://www.npmjs.com/package/downpile-node-modules-webpack-loader)
[![Codecov](https://img.shields.io/codecov/c/github/hiroppy/downpile-node-modules-webpack-loader.svg?style=flat-square)](https://codecov.io/gh/hiroppy/downpile-node-modules-webpack-loader)

**This plugin is experimental.**

We should avoid considering node_modules code anytime but some node_modules are over es2015 so we need to downpile these code if we support IE11. This plugin supports only downpile using Babel, and cache for performance.

## Install

```sh
$ npm i downpile-node-modules-webpack-loader -D
```

## Usage

```javascript
// webpack.config.js

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        use: {
          loader: 'downpile-node-modules-webpack-loader',
          options: {
            ignoredLibraries: [],
            polyfill: true,
            ecmaVersion: 5,
          },
        },
        include: /node_modules/,
      },
    ],
  },
};
```

## Development

```sh
$ npm i
$ make setup
$ npm test
```
