import fs from "fs";
import path from "path";
import { PostHTML } from "posthtml";
import hasha from "hasha";

const DEFAULT_HASH_LENGTH = 20;
const DEFAULT_PATTERN = new RegExp(/\[hash.*]/g);

export function replaceHash(
  str: string,
  buffer: Buffer,
  exp: RegExp,
  hashLength: number
) {
  const match = str.match(exp);
  const [_, len] = match![0].replace(/\[|]/g, "").split(":");

  return str.replace(exp, hasha(buffer).slice(0, Number(len) || hashLength));
}

type NodeWithHashRegex = { attrs: { href?: string; src?: string } };

function plugin(options?: {
  path?: string;
  hashLength?: number;
  pattern?: RegExp;
}) {
  return function posthtmlHash(tree: PostHTML.Node) {
    const exp = options?.pattern || DEFAULT_PATTERN;
    const hashLength = options?.hashLength || DEFAULT_HASH_LENGTH;

    tree.match([{ attrs: { href: exp } }, { attrs: { src: exp } }], (node) => {
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
        const hashedFileName = replaceHash(fileName, buffer, exp, hashLength);
        const hashedFile = path.join(process.cwd(), pathToFile, hashedFileName);

        fs.renameSync(file, hashedFile);

        if (href) {
          _node.attrs.href = hashedFileName;
        } else if (src) {
          _node.attrs.src = hashedFileName;
        }
      }

      return node;
    });
  };
}

export default plugin;
export { plugin as hash, plugin as posthtmlHash };
