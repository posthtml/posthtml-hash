const fs = require("fs");
const posthtml = require("posthtml");
const { hash } = require("posthtml-hash");

const html = fs.readFileSync("./processed/index.html");

posthtml()
  .use(hash({ path: "processed" }))
  .process(html)
  .then((result) => fs.writeFileSync("./processed/index.html", result.html));
