import fs from "fs";
import path from "path";
import { PostHTML } from "posthtml";
import { createHash, hashFileName, processFile } from "./utils";

const DEFAULT_PATH = "";
const DEFAULT_HASH_LENGTH = 20;
const DEFAULT_OPTIONS: IOptions = {
  path: DEFAULT_PATH,
  hashLength: DEFAULT_HASH_LENGTH,
  css: true,
  js: true,
};

function plugin(options = DEFAULT_OPTIONS) {
  return function posthtmlHash(tree: PostHTML.Node) {
    const hashLength = options.hashLength || DEFAULT_HASH_LENGTH;
    const css = options.css !== undefined ? options.css : DEFAULT_OPTIONS.css;
    const js = options.js !== undefined ? options.js : DEFAULT_OPTIONS.js;
    const nonEmptyString = new RegExp(/\S+/);
    const matchers = ([
      css && {
        tag: "link",
        attrs: { rel: "stylesheet", href: nonEmptyString },
      },
      js && { tag: "script", attrs: { src: nonEmptyString } },
    ].filter(Boolean) as unknown) as IPostHTMLHashMatcher[];

    tree.match(matchers, (node) => {
      const attrs = node.attrs!;
      let fileName = "";

      if (attrs.href) {
        fileName = attrs.href;
      } else if (attrs.src) {
        fileName = attrs.src;
      }

      const pathToFile = options.path || "";
      const file = path.join(process.cwd(), pathToFile, fileName);

      processFile(file, () => {
        const buffer = fs.readFileSync(file);
        const hash = createHash(buffer, hashLength);
        const hashedFileName = hashFileName(fileName, hash);
        const hashedFile = path.join(process.cwd(), pathToFile, hashedFileName);

        fs.renameSync(file, hashedFile);

        if (attrs.href) {
          node.attrs!.href = hashedFileName;
        } else if (attrs.src) {
          node.attrs!.src = hashedFileName;
        }
      });

      return node;
    });
  };
}

interface IOptions {
  path?: string;
  hashLength?: number;
  css?: boolean;
  js?: boolean;
}

interface IPostHTMLHashMatcher {
  tag: PostHTML.StringMatcher;
  attrs: PostHTML.AttrMatcher;
}

export { plugin, DEFAULT_HASH_LENGTH };
