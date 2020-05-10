import fs from "fs";
import path from "path";
import { PostHTML } from "posthtml";
import hasha from "hasha";

const DEFAULT_HASH_LENGTH = 20;
const REGEX_HASH = new RegExp(/\[hash.*]/g);

export function replaceHash(str: string, buffer: Buffer) {
  const match = str.match(REGEX_HASH);
  const [_, len] = match![0].replace(/\[|]/g, "").split(":");

  return str.replace(
    REGEX_HASH,
    hasha(buffer).slice(0, Number(len) || DEFAULT_HASH_LENGTH)
  );
}

type NodeWithHashRegex = { attrs: { href?: string; src?: string } };

function plugin(options?: { path?: string }) {
  return function posthtmlHash(tree: PostHTML.Node) {
    tree.match(
      [{ attrs: { href: REGEX_HASH } }, { attrs: { src: REGEX_HASH } }],
      (node) => {
        const _node = (node as unknown) as NodeWithHashRegex;
        const { href, src } = _node.attrs;

        let fileName = "";

        if (href) {
          fileName = href;
        } else if (src) {
          fileName = src;
        }

        const pathToFile = options?.path || "";
        const file = path.join(process.cwd(), pathToFile, fileName);

        if (fs.existsSync(file)) {
          const buffer = fs.readFileSync(file);
          const hashedFileName = replaceHash(fileName, buffer);
          const hashedFile = path.join(
            process.cwd(),
            pathToFile,
            hashedFileName
          );

          fs.renameSync(file, hashedFile);

          if (href) {
            _node.attrs.href = hashedFileName;
          } else if (src) {
            _node.attrs.src = hashedFileName;
          }
        }

        return node;
      }
    );
  };
}

export default plugin;
export { plugin as hash, plugin as posthtmlHash };
