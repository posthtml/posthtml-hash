# posthtml-hash <img align="right" width="220" height="200" title="PostHTML logo" src="http://posthtml.github.io/posthtml/logo.svg">

[![NPM][npm]][npm-url]

`posthtml-hash` is a [PostHTML](https://github.com/posthtml/posthtml) plugin for hashing file names to enable caching.

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

By default, the plugin will attempt to hash file names that contain `[hash]`. As an additional qualifier, only nodes containing `href`, `src`, or `content` attributes are eligible.

```html
<html>
  <head>
    <!-- ✅ hashed -->
    <link rel="stylesheet" href="style.[hash].css" />

    <!-- ❌ not hashed -->
    <link rel="stylesheet" href="reset.css" />
  </head>
  <body>
    <!-- ✅ hashed -->
    <script src="src.[hash].js"></script>

    <!-- ❌ not hashed -->
    <script src="analytics.js"></script>
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

### Custom Hash Length

Customize the hash length by specifying an integer after the `hash:{NUMBER}`. The default hash length is `20`.

**Note**: This only works for a pattern that uses square brackets and a colon separator. Use the `hashLength` option for different patterns.

```html
<script src="src.[hash].js"></script>
<!-- src.b0dcc67ffc1fd562f212.js -->

<script src="src.[hash:8].js"></script>
<!-- src.b0dcc67f.js -->
```

### Options

This plugin assumes that the file to process is in the same directory as the PostHTML script. If not, specify the relative path to the html file in `options.path`:

```js
hash({
  /**
   * Relative path to the HTML file being processed
   * @default ""
   */
  path: "public",

  /**
   * File name pattern (regular expression) to match
   * @default new RegExp(/\[hash.*]/g)
   */
  pattern: new RegExp(/custom-file-pattern/),

  /**
   * Hash length
   * @default 20
   */
  hashLength: 8,

  /**
   * Transform the href/src/content attribute value to a relative file path
   * @default (filepath) => filepath
   */
  transformPath: (filepath) => filepath.replace("https://example.com/", ""),
});
```

## Recipes

### Custom Pattern and Hash Length

```js
hash({
  pattern: new RegExp(/custom-file-pattern/),
  hashLength: 8,
});
```

Result:

```diff
- <script src="script.custom-file-pattern.js"></script>
+ <script src="script.b0dcc67f.js"></script>
```

### Remote origin URLs

Input HTML:

```html
<head>
  <meta charset="utf-8" />
  <!-- We want to hash this image file name and preserve the remote origin URL -->
  <meta property="og:image" content="https://example.com/image.[hash].png" />
</head>
```

```js
hash({
  transformPath: (filepath) => {
    // removes the targeted remote origin URL when looking up the files locally
    return filepath.replace("https://example.com/", "");
  },
});
```

## Examples

See the [examples folder](examples) for end-to-end use cases.

## Contributing

See the [PostHTML Guidelines](https://github.com/posthtml/posthtml/tree/master/docs).

## [Changelog](CHANGELOG.md)

## License

[MIT](LICENSE)

[npm]: https://img.shields.io/npm/v/posthtml-hash.svg?color=blue
[npm-url]: https://npmjs.com/package/posthtml-hash
