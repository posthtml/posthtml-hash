import fs from "fs";
import path from "path";
import type PostHTML from "posthtml";
import hasha from "hasha";

const DEFAULT_HASH_LENGTH = 20;
const DEFAULT_PATTERN = new RegExp(/\[hash.*]/g);

export const replaceHash = (
  str: string,
  buffer: Buffer,
  exp: RegExp,
  hashLength: number
) => {
  const match = str.match(exp);
  const [_, len] = match![0].replace(/\[|]/g, "").split(":");

  return str.replace(exp, hasha(buffer).slice(0, Number(len) || hashLength));
};

interface PostHTMLHashOptions {
  path?: string;
  hashLength?: number;
  pattern?: RegExp;
  transformPath?: (filepath: string) => string;
}

const plugin = (options?: PostHTMLHashOptions) => {
  const hashedUrls = new Map<string, string>();

  return (tree: PostHTML.Node) => {
    const exp = options?.pattern || DEFAULT_PATTERN;
    const hashLength = options?.hashLength || DEFAULT_HASH_LENGTH;
    const transformPath = options?.transformPath || ((filepath) => filepath);

    tree.match(
      [
        { attrs: { href: exp } },
        { attrs: { src: exp } },
        { attrs: { content: exp } },
      ],
      (node) => {
        const _node = node as unknown as NodeWithHashRegex;
        const { href, src, content } = _node.attrs;
        const fileName = href! || src! || content!;
        const transformedFileName = transformPath(fileName);
        const pathToFile = options?.path || "";
        const file = path.join(process.cwd(), pathToFile, transformedFileName!);

        if (hashedUrls.has(file)) {
          const existingHashedUrl = hashedUrls.get(file);

          if (href) _node.attrs.href = existingHashedUrl;
          if (src) _node.attrs.src = existingHashedUrl;
          if (content) _node.attrs.content = existingHashedUrl;
        } else {
          if (fs.existsSync(file)) {
            const buffer = fs.readFileSync(file);
            const hashedFileName = replaceHash(
              fileName!,
              buffer,
              exp,
              hashLength
            );
            const transformedHashedFileName = transformPath(hashedFileName);
            const hashedFile = path.join(
              process.cwd(),
              pathToFile,
              transformedHashedFileName
            );

            fs.renameSync(file, hashedFile);
            hashedUrls.set(file, hashedFileName);

            if (href) _node.attrs.href = hashedFileName;
            if (src) _node.attrs.src = hashedFileName;
            if (content) _node.attrs.content = hashedFileName;
          } else {
            console.log("File does not exist:", file);
          }
        }

        return node;
      }
    );
  };
};

export default plugin;
export { plugin as hash, plugin as posthtmlHash };
