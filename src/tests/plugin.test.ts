import { strict as test } from "assert";
import { hash, replaceHash } from "../plugin";
import fs from "fs";
import path from "path";
import posthtml from "posthtml";

const buffer = fs.readFileSync(
  path.resolve(__dirname, "__fixtures__/original/bundle.min.[hash].js")
);

test.equal(replaceHash("[hash].js", buffer), "b0dcc67ffc1fd562f212.js");
test.equal(
  replaceHash("script.[hash].js", buffer),
  "script.b0dcc67ffc1fd562f212.js"
);
test.equal(
  replaceHash("script.[hash:20].js", buffer),
  "script.b0dcc67ffc1fd562f212.js"
);
test.equal(replaceHash("script.[hash:8].js", buffer), "script.b0dcc67f.js");
test.throws(() => replaceHash("script.js", buffer));
test.throws(() => replaceHash("script[].js", buffer));
test.throws(() => replaceHash("script.[has:8].js", buffer));
test.throws(() => replaceHash("script.js", buffer));

function copyFixture(fileName: string) {
  const file = path.join(__dirname, "__fixtures__/original", fileName);
  fs.copyFileSync(
    file,
    path.join(__dirname, "__fixtures__/processed", fileName)
  );
}

async function fixture() {
  copyFixture("bundle.min.[hash].css");
  copyFixture("bundle.min.[hash].js");

  const result = await posthtml()
    .use(hash({ path: "src/tests/__fixtures__/processed" }))
    .process(
      `<html>
        <head>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans:400,400i,600,600i,700,700i" />
          <link rel="stylesheet" href="bundle.min.[hash].css" />
        </head>
        <body>
          <script src="bundle.min.[hash].js"></script>
        </body>
      </html>`
    );

  test.equal(
    result.html.replace(/\n|\s+/g, ""),
    '<html><head><linkrel="stylesheet"href="https://fonts.googleapis.com/css?family=Open+Sans:400,400i,600,600i,700,700i"><linkrel="stylesheet"href="bundle.min.9a6cf95c41e87b9dc102.css"></head><body><scriptsrc="bundle.min.b0dcc67ffc1fd562f212.js"></script></body></html>'
  );
}

fixture();
