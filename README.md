# posthtml-hash <img align="right" width="220" height="200" title="PostHTML logo" src="http://posthtml.github.io/posthtml/logo.svg">

[![NPM][npm]][npm-url]

`posthtml-hash` is a [PostHTML](https://github.com/posthtml/posthtml) plugin for hashing static assets to enable caching.

```diff
<html>
  <head>
-   <link rel="stylesheet" href="styles.[hash].css" />
+   <link rel="stylesheet" href="styles.9a6cf95c41e87b9dc102.css" />
  </head>
  <body>
-   <script src="src.[hash].js"></script>
+   <script src="src.b0dcc67ffc1fd562f212.js"></script>
  </body>
</html>
```

## Install

```bash
yarn add -D posthtml-hash
# OR
npm i -D posthtml-hash
```

## Usage

### Input

The plugin will only attempt to hash files with `[hash]` in the name.

```html
<html>
  <head>
    <!-- not hashed -->
    <link rel="stylesheet" href="reset.css" />

    <!-- hashed -->
    <link rel="stylesheet" href="style.[hash].css" />
  </head>
  <body>
    <!-- not hashed -->
    <script src="analytics.js"></script>

    <!-- hashed -->
    <script src="src.[hash].js"></script>
  </body>
</html>
```

### Node.js

The recommended usage of this plugin is to incorporate it in your post-build process.

Let's say that you use Rollup to bundle and minify your CSS and JavaScript. The template `index.html` is copied to the `build` folder.

```js
// postbuild.js
const fs = require("fs");
const posthtml = require("posthtml");
const { hash } = require("posthtml-hash");

const html = fs.readFileSync("./build/index.html");

posthtml()
  .use(hash({ path: "build" }))
  .process(html)
  .then((result) => fs.writeFileSync("./build/index.html", result.html));
```

For convenience, you can add the post-build script to your package.json. The `postbuild` script is automatically invoked following the `build` script.

```json
{
  "scripts": {
    "build": "rollup -c",
    "postbuild": "node postbuild.js"
  }
}
```

### Options

This plugin assumes that the file to process is in the same directory as the posthtml script. If not, specify the relative path to the html file in `options.path`:

```js
hash({
  /**
   * Relative path to processed HTML file
   */
  path: "public", // default: ""
});
```

### Custom Hash Length

Customize the hash length by specifying an integer after the `hash:{NUMBER}`. The default hash length is `20`.

```html
<script src="src.[hash].js"></script>
<!-- src.b0dcc67ffc1fd562f212.js -->

<script src="src.[hash:8].js"></script>
<!-- src.b0dcc67f.js -->
```

## [Examples](examples)

## Contributing

See the [PostHTML Guidelines](https://github.com/posthtml/posthtml/tree/master/docs).

## [Changelog](CHANGELOG.md)

## License

[MIT](LICENSE)

[npm]: https://img.shields.io/npm/v/posthtml-hash.svg?color=blue
[npm-url]: https://npmjs.com/package/posthtml-hash
