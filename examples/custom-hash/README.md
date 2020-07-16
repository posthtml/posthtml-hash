# examples/basic

> Basic usage of the [posthtml-hash](../..) plugin.

The assets in the [original/](original) folder contains unprocessed assets for reference; they are not directly manipulated in this example. The corresponding output is the [processed/](processed) folder.

## Script

The [script.js](script.js) file contains the script that runs posthtml.

```js
// script.js
const fs = require("fs");
const posthtml = require("posthtml");
const { hash } = require("posthtml-hash");

const html = fs.readFileSync("./processed/index.html");

posthtml()
  .use(hash({ path: "processed", pattern: new RegExp(/custom-hash/) }))
  .process(html)
  .then((result) => fs.writeFileSync("./processed/index.html", result.html));
```

## Running Locally

Clone the repo and install the dependencies:

```bash
git clone git@github.com:posthtml/posthtml-hash.git
cd posthtml-hash/examples/basic
yarn install
```

Run the script:

```bash
yarn hash
```

To restore the processed folder to its unprocessed state, run:

```bash
yarn clean
```
