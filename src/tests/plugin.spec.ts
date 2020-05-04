import fs from "fs";
import path from "path";
import posthtml from "posthtml";
import plugin from "../";

describe("posthtml-hash", () => {
  beforeEach(() => {
    const folder = {
      input: "__fixtures__/original",
      output: "__fixtures__/processed",
    };

    copyFixture("bundle.min.css", folder);
    copyFixture("bundle.min.js", folder);
  });

  it("matches the snapshot – css only", () => {
    posthtml()
      .use(plugin({ path: "src/tests/__fixtures__/processed", js: false }))
      .process(
        `
        <html>
          <head>
            <link
              rel="stylesheet"
              href="https://fonts.googleapis.com/css?family=Open+Sans:400,400i,600,600i,700,700i"
            />
            <link rel="stylesheet" href="bundle.min.css" />
          </head>
          <body>
            <script src="bundle.min.js"></script>
          </body>
        </html>
      `
      )
      .then((result) => {
        expect(result.html).toMatchSnapshot();
      });
  });

  it("matches the snapshot – js only", () => {
    posthtml()
      .use(plugin({ path: "src/tests/__fixtures__/processed", css: false }))
      .process(
        `
        <html>
          <head>
            <link
              rel="stylesheet"
              href="https://fonts.googleapis.com/css?family=Open+Sans:400,400i,600,600i,700,700i"
            />
            <link rel="stylesheet" href="bundle.min.css" />
          </head>
          <body>
            <script src="bundle.min.js"></script>
          </body>
        </html>
      `
      )
      .then((result) => {
        expect(result.html).toMatchSnapshot();
      });
  });

  it("matches the snapshot – no hash", () => {
    posthtml()
      .use(
        plugin({
          path: "src/tests/__fixtures__/processed",
          css: false,
          js: false,
        })
      )
      .process(
        `
        <html>
          <head>
            <link
              rel="stylesheet"
              href="https://fonts.googleapis.com/css?family=Open+Sans:400,400i,600,600i,700,700i"
            />
            <link rel="stylesheet" href="bundle.min.css" />
          </head>
          <body>
            <script src="bundle.min.js"></script>
          </body>
        </html>
      `
      )
      .then((result) => {
        expect(result.html).toMatchSnapshot();
      });
  });

  it("matches the snapshot – default options", () => {
    posthtml()
      .use(plugin({ path: "src/tests/__fixtures__/processed" }))
      .process(
        `
        <html>
          <head>
            <link rel="stylesheet" href="bundle.min.css" />
          </head>
          <body>
            <script src="bundle.min.js"></script>
          </body>
        </html>
      `
      )
      .then((result) => {
        expect(result.html).toMatchSnapshot();
      });
  });

  it("matches the snapshot – custom hash length", () => {
    posthtml()
      .use(plugin({ path: "src/tests/__fixtures__/processed", hashLength: 10 }))
      .process(
        `
        <html>
          <head>
            <link rel="stylesheet" href="bundle.min.css" />
          </head>
          <body>
            <script src="bundle.min.js"></script>
          </body>
        </html>
      `
      )
      .then((result) => {
        expect(result.html).toMatchSnapshot();
      });
  });
});

function copyFixture(
  fileName: string,
  folder: { input: string; output: string }
) {
  const file = path.join(__dirname, folder.input, fileName);
  fs.copyFileSync(file, path.join(__dirname, folder.output, fileName));
}
