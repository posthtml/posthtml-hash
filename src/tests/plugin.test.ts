import { test, expect } from "vitest";
import { hash, replaceHash } from "../plugin";
import fs from "fs";
import path from "path";
import posthtml from "posthtml";

if (!fs.existsSync("src/tests/__fixtures__/processed")) {
  fs.mkdirSync("src/tests/__fixtures__/processed");
}

const buffer = fs.readFileSync(path.resolve(__dirname, "__fixtures__/original/bundle.min.[hash].js"));

const DEFAULT_HASH_LENGTH = 20;
const DEFAULT_PATTERN = new RegExp(/\[hash.*]/g);

test("posthtml-hash", () => {
  expect(replaceHash("[hash].js", buffer, DEFAULT_PATTERN, DEFAULT_HASH_LENGTH)).toEqual("b0dcc67ffc1fd562f212.js");
  expect(replaceHash("script.[hash].js", buffer, DEFAULT_PATTERN, DEFAULT_HASH_LENGTH)).toEqual(
    "script.b0dcc67ffc1fd562f212.js"
  );
  expect(replaceHash("script.[hash:20].js", buffer, DEFAULT_PATTERN, DEFAULT_HASH_LENGTH)).toEqual(
    "script.b0dcc67ffc1fd562f212.js"
  );
  expect(replaceHash("script.[hash:8].js", buffer, DEFAULT_PATTERN, DEFAULT_HASH_LENGTH)).toEqual("script.b0dcc67f.js");
  expect(() => replaceHash("script[].js", buffer, DEFAULT_PATTERN, DEFAULT_HASH_LENGTH)).toThrow();
  expect(() => replaceHash("script.[has:8].js", buffer, DEFAULT_PATTERN, DEFAULT_HASH_LENGTH)).toThrow();
  expect(() => replaceHash("script.js", buffer, DEFAULT_PATTERN, DEFAULT_HASH_LENGTH)).toThrow();
  expect(() => replaceHash("script.js", buffer, DEFAULT_PATTERN, DEFAULT_HASH_LENGTH)).toThrow();

  const CUSTOM_EXP = new RegExp(/\[oh-my-hash.*]/g);

  expect(replaceHash("[oh-my-hash].js", buffer, CUSTOM_EXP, DEFAULT_HASH_LENGTH), "b0dcc67ffc1fd562f212.js");
  expect(replaceHash("script.[oh-my-hash].js", buffer, CUSTOM_EXP, 8), "script.b0dcc67f.js");

  const CUSTOM_EXP_2 = new RegExp(/\oh-my-hash/);

  expect(replaceHash("oh-my-hash.js", buffer, CUSTOM_EXP_2, DEFAULT_HASH_LENGTH), "b0dcc67ffc1fd562f212.js");
  expect(replaceHash("script.oh-my-hash.js", buffer, CUSTOM_EXP_2, 8), "script.b0dcc67f.js");

  const CUSTOM_EXP_3 = new RegExp(/custom-hash/);

  expect(replaceHash("script.custom-hash.js", buffer, CUSTOM_EXP_3, DEFAULT_HASH_LENGTH)).toEqual(
    "script.b0dcc67ffc1fd562f212.js"
  );
  expect(replaceHash("script.custom-hash.js", buffer, CUSTOM_EXP_3, 4)).toEqual("script.b0dc.js");
});

function copyFixture(fileName: string) {
  const file = path.join(__dirname, "__fixtures__/original", fileName);
  fs.copyFileSync(file, path.join(__dirname, "__fixtures__/processed", fileName));
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

  expect(
    result.html.replace(/\n|\s+/g, ""),
    '<html><head><linkrel="stylesheet"href="https://fonts.googleapis.com/css?family=Open+Sans:400,400i,600,600i,700,700i"><linkrel="stylesheet"href="bundle.min.9a6cf95c41e87b9dc102.css"></head><body><scriptsrc="bundle.min.b0dcc67ffc1fd562f212.js"></script></body></html>'
  );

  copyFixture("script.oh-my-hash.js");

  const result2 = await posthtml()
    .use(
      hash({
        path: "src/tests/__fixtures__/processed",
        pattern: new RegExp(/oh-my-hash/),
        hashLength: 8,
        transformPath: (filepath) => {
          return filepath;
        },
      })
    )
    .process(
      `<html>
        <body>
          <script src="script.oh-my-hash.js"></script>
          <script src="script.oh-my-hash.js"></script>
        </body>
      </html>`
    );

  expect(
    result2.html.replace(/\n|\s+/g, ""),
    '<html><body><scriptsrc="script.b0dcc67f.js"></script><scriptsrc="script.b0dcc67f.js"></script></body></html>'
  );
}

fixture();
