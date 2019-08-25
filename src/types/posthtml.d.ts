declare module 'posthtml' {
  export interface INode {
    tag?: string;
    attrs?: {
      id?: string;
      class?: string;
      target?: string;
      href?: string;
      rel?: string;
      src?: string;
    };
    content?: INode[];
  }

  export type Match = string | RegExp;

  export interface IMatcher {
    tag?: string;
    attrs?: {
      id?: Match;
      class?: Match;
      target?: Match;
      href?: Match;
      rel?: Match;
      src?: Match;
    };
    content?: IMatcher[];
  }

  export interface ITree {
    match: (
      matcher: IMatcher | IMatcher[],
      node: (node: INode) => INode
    ) => void;
  }

  export default function(): any;
}
