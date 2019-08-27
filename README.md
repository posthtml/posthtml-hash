# posthtml-hash <img align="right" width="220" height="200" title="PostHTML logo" src="http://posthtml.github.io/posthtml/logo.svg">

[![NPM][npm]][npm-url]
[![Deps][deps]][deps-url]
[![Build][build]][build-badge]
[![Coverage][codecov-shield]][codecov]

`posthtml-hash` is a [PostHTML](https://github.com/posthtml/posthtml) plugin for hashing static assets. This plugin uses [hasha](https://www.npmjs.com/package/hasha) to generate unique hashes.

Currently, this plugin supports CSS and JS files.

**Before:**

```html
<html>
  <head>
    <link rel="stylesheet" href="stylesheet.css" />
  </head>
  <body>
    <script src="main.js"></script>
  </body>
</html>
```

**After:**

```html
<html>
  <head>
    <link rel="stylesheet" href="stylesheet.9a6cf95c41e87b9dc102.css" />
  </head>
  <body>
    <script src="main.b0dcc67ffc1fd562f212.js"></script>
  </body>
</html>
```

## Install

```bash
yarn add -D posthtml-hash
# OR
npm i posthtml-hash
```

## Usage

```js
const fs = require('fs');
const posthtml = require('posthtml');
const { hash } = require('posthtml-hash');

const html = fs.readFileSync('./index.html');

posthtml()
  .use(hash())
  .process(html)
  .then(result => fs.writeFileSync('./index.html', result.html));
```

## Options

This plugin assumes that the file to process is in the same directory as the posthtml script. If not, specify the relative path to the html file in `options.path`:

```js
const fs = require('fs');
const posthtml = require('posthtml');
const { hash } = require('posthtml-hash');

const html = fs.readFileSync('./public/index.html');

posthtml()
  .use(
    hash({
      /**
       * Relative path to processed HTML file
       */
      path: 'public',

      /**
       * Length of hash
       * Default is 20
       */
      hashLength: 10
    })
  )
  .process(html)
  .then(result => fs.writeFileSync('./index.html', result.html));
```

## [Examples](examples)

## Contributing

See the [PostHTML Guidelines](https://github.com/posthtml/posthtml/tree/master/docs).

## [Changelog](CHANGELOG.md)

## License

[MIT](LICENSE)

[npm]: https://img.shields.io/npm/v/posthtml-hash.svg?color=blue
[npm-url]: https://npmjs.com/package/posthtml-hash
[deps]: https://david-dm.org/metonym/posthtml-hash.svg
[deps-url]: https://david-dm.org/metonym/posthtml-hash
[build]: https://travis-ci.com/metonym/posthtml-hash.svg?branch=master
[build-badge]: https://travis-ci.com/metonym/posthtml-hash
[codecov]: https://codecov.io/gh/metonym/posthtml-hash
[codecov-shield]: https://img.shields.io/codecov/c/github/metonym/posthtml-hash.svg
