import fs from 'fs';
import path from 'path';
import { PostHTML } from 'posthtml';
import { createHash, hashFileName, processFile } from './utils';

const DEFAULT_PATH = '';
const DEFAULT_HASH_LENGTH = 20;
const DEFAULT_OPTIONS: IOptions = {
  path: DEFAULT_PATH,
  hashLength: DEFAULT_HASH_LENGTH
};

function plugin(options = DEFAULT_OPTIONS) {
  return function posthtmlHash(tree: PostHTML.Node) {
    const nonEmptyString = new RegExp(/\S+/);

    const matchers: IPostHTMLHashMatcher[] = [
      { tag: 'link', attrs: { rel: 'stylesheet', href: nonEmptyString } },
      { tag: 'script', attrs: { src: nonEmptyString } }
    ];

    tree.match(matchers, node => {
      const attrs = node.attrs!;
      let fileName = '';

      if (attrs.href) {
        fileName = attrs.href;
      } else if (attrs.src) {
        fileName = attrs.src;
      }

      const pathToFile = options.path || '';
      const file = path.join(process.cwd(), pathToFile, fileName);

      processFile(file, () => {
        const buffer = fs.readFileSync(file);
        const hashLength = options.hashLength || DEFAULT_HASH_LENGTH;
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
}

interface IPostHTMLHashMatcher {
  tag: PostHTML.StringMatcher;
  attrs: PostHTML.AttrMatcher;
}

export { plugin, DEFAULT_HASH_LENGTH };
