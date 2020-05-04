# posthtml-hash <img align="right" width="220" height="200" title="PostHTML logo" src="http://posthtml.github.io/posthtml/logo.svg">

[![NPM][npm]][npm-url]

`posthtml-hash` is a [PostHTML](https://github.com/posthtml/posthtml) plugin for hashing static CSS/JS assets to enable caching. [hasha](https://www.npmjs.com/package/hasha) is used to generate hashes.

```diff
<html>
  <head>
-   <link rel="stylesheet" href="stylesheet.css" />
+   <link rel="stylesheet" href="stylesheet.9a6cf95c41e87b9dc102.css" />
  </head>
  <body>
-   <script src="main.js"></script>
+   <script src="main.b0dcc67ffc1fd562f212.js"></script>
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
const fs = require("fs");
const posthtml = require("posthtml");
const { hash } = require("posthtml-hash");

const html = fs.readFileSync("./index.html");

posthtml()
  .use(hash())
  .process(html)
  .then((result) => fs.writeFileSync("./index.html", result.html));
```

## Options

This plugin assumes that the file to process is in the same directory as the posthtml script. If not, specify the relative path to the html file in `options.path`:

```js
const fs = require("fs");
const posthtml = require("posthtml");
const { hash } = require("posthtml-hash");

const html = fs.readFileSync("./public/index.html");

posthtml()
  .use(
    hash({
      /**
       * Relative path to processed HTML file
       */
      path: "public", // default: ""

      /**
       * Length of hash
       */
      hashLength: 10, // default: 20

      /**
       * Hash CSS files
       */
      css: true, // default: true

      /**
       * Hash JS files
       */
      js: true, // default: true
    })
  )
  .process(html)
  .then((result) => fs.writeFileSync("./index.html", result.html));
```

## [Examples](examples)

## Contributing

See the [PostHTML Guidelines](https://github.com/posthtml/posthtml/tree/master/docs).

## [Changelog](CHANGELOG.md)

## License

[MIT](LICENSE)

[npm]: https://img.shields.io/npm/v/posthtml-hash.svg?color=blue
[npm-url]: https://npmjs.com/package/posthtml-hash
