const fs = require("fs");
const posthtml = require("posthtml");
const { hash } = require("posthtml-hash");

const html = fs.readFileSync("./processed/index.html");

posthtml()
  .use(
    hash({
      path: "processed",
      hashLength: 6,
      transformPath: (filepath) => {
        console.log(filepath.replace("https://example.com/", ""));
        return filepath.replace("https://example.com/", "");
      },
    })
  )
  .process(html)
  .then((result) => fs.writeFileSync("./processed/index.html", result.html));
