import { gql } from "apollo-server-koa";
import { GraphQLResolveInfo } from "graphql";

export const forwardConnectionArgs = `
  first: Int,
  after: String
`;
export const backwardConnectionArgs = `
  last: Int,
  before: String
`;
export const connectionArgs = `
  ${backwardConnectionArgs},
  ${forwardConnectionArgs}
`;

export function ConnectionType(Node: string): string {
  return `
    type ${Node}Edge {
      cursor: String!
      node: ${Node}!
    }
    type ${Node}Connection {
      pageInfo: PageInfo!
      edges: [${Node}Edge!]!
    }
  `;
}

export type ConnectionOptions = {
  offset: number;
  limit?: number;
};
/*function forwardConnectionOptions(
  first: number,
  after: string
): ConnectionOptions {
  const offset = cursorToOffset(after);
  const limit = first;
  return { offset, limit };
}
function backwardConnectionOptions(
  last: number,
  before: string
): ConnectionOptions {
  const lastOffset = cursorToOffset(before);
  if (lastOffset < last) {
    const offset = 0;
    const limit = lastOffset;
    return { offset, limit };
  } else {
    const offset = lastOffset - last;
    const limit = last;
    return { offset, limit };
  }
}

type Edge<N> = {
  cursor: string;
  node: N;
};
type PageInfo = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
};
type Connection<N> = {
  pageInfo: PageInfo;
  edges: Array<Edge<N>>;
};
function buildConnection<N>(
  nodes: Array<N>,
  options: ConnectionOptions
): Connection<N> {
  const { offset } = options;
  const startCursor = nodes && nodes.length > 0 ? offsetToCursor(offset) : null;
  const endCursor =
    nodes && nodes.length > 0
      ? offsetToCursor(offset + nodes.length - 1)
      : null;

  const pageInfo = {
    hasNextPage: false,
    hasPreviousPage: false,
    startCursor,
    endCursor
  };

  return {
    edges: nodes.map((node, i) => ({
      cursor: offsetToCursor(offset + i),
      node
    })),
    pageInfo
  };
}

type ForwardConnectionArgs = {
  first?: number | null;
  after?: string | null;
};
type BackwardConnectionArgs = {
  last?: number | null;
  before?: string | null;
};
type ConnectionArgs = ForwardConnectionArgs & BackwardConnectionArgs;
type NodeResolver<O, A, C, N> = (
  obj: O,
  connOpts: ConnectionOptions,
  args: A,
  ctx: C,
  info: GraphQLResolveInfo
) => Promise<N[]> | N[];
type ConnectionResolver<O, A, C, N> = (
  obj: O,
  args: A,
  ctx: C,
  info: GraphQLResolveInfo
) => Promise<Connection<N>>;

export function resolveForwardConnection<
  Obj,
  Args extends ForwardConnectionArgs,
  Ctx,
  Node
>(
  nodesResolver: NodeResolver<Obj, Args, Ctx, Node>
): ConnectionResolver<Obj, Args, Ctx, Node> {
  return async (obj, args, context, info) => {
    const options: ConnectionOptions =
      args.first && args.after
        ? forwardConnectionOptions(args.first, args.after)
        : { offset: 0 };
    const nodes = await nodesResolver(obj, options, args, context, info);
    return buildConnection(nodes, options);
  };
}

export function resolveBackwardConnection<
  Obj,
  Args extends BackwardConnectionArgs,
  Ctx,
  Node
>(
  nodesResolver: NodeResolver<Obj, Args, Ctx, Node>
): ConnectionResolver<Obj, Args, Ctx, Node> {
  return async (obj, args, context, info) => {
    const options: ConnectionOptions =
      args.last && args.before
        ? backwardConnectionOptions(args.last, args.before)
        : { offset: 0 };
    const nodes = await nodesResolver(obj, options, args, context, info);
    return buildConnection(nodes, options);
  };
}

export function resolveConnection<Obj, Args extends ConnectionArgs, Ctx, Node>(
  nodesResolver: NodeResolver<Obj, Args, Ctx, Node>
): ConnectionResolver<Obj, Args, Ctx, Node> {
  return async (obj, args, context, info) => {
    const options: ConnectionOptions =
      args.first && args.after
        ? forwardConnectionOptions(args.first, args.after)
        : args.last && args.before
        ? backwardConnectionOptions(args.last, args.before)
        : { offset: 0 };
    const nodes = await nodesResolver(obj, options, args, context, info);
    return buildConnection(nodes, options);
  };
}*/

type PageInfo = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
};
export const GQLPageInfo = gql`
  type PageInfo {
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
    startCursor: String
    endCursor: String
  }
`;

const PREFIX = "arrayconnection:";
export type ConnectionCursor = string;
function offsetToCursor(offset: number): ConnectionCursor {
  return Buffer.from(PREFIX + offset, "utf8").toString("base64");
}
function cursorToOffset(cursor: ConnectionCursor): number {
  const i = Buffer.from(cursor, "base64").toString("utf8");
  return parseInt(i.substring(PREFIX.length), 10);
}

type Edge<N> = {
  cursor: string;
  node: N;
};
type Connection<N> = {
  pageInfo: PageInfo;
  edges: Array<Edge<N>>;
};
function buildConnection<N>(
  nodes: Array<N>,
  options: ConnectionOptions
): Connection<N> {
  const { offset } = options;
  const startCursor = nodes && nodes.length > 0 ? offsetToCursor(offset) : null;
  const endCursor =
    nodes && nodes.length > 0
      ? offsetToCursor(offset + nodes.length - 1)
      : null;

  const pageInfo = {
    hasNextPage: false,
    hasPreviousPage: offset > 0,
    startCursor,
    endCursor,
  };

  return {
    edges: nodes.map((node, i) => ({
      cursor: offsetToCursor(offset + i),
      node,
    })),
    pageInfo,
  };
}

type ConnectionArgs = {
  first?: number | null;
  after?: string | null;
  last?: number | null;
  before?: string | null;
};
type NodeResolver<O, A, C, N> = (
  obj: O,
  connOpts: ConnectionOptions,
  args: A,
  ctx: C,
  info: GraphQLResolveInfo
) => Promise<N[]> | N[];
type ConnectionResolver<O, A, C, N> = (
  obj: O,
  args: A,
  ctx: C,
  info: GraphQLResolveInfo
) => Promise<Connection<N>>;

export class ConnectionError extends Error {}

export function resolveConnection<Obj, Args extends ConnectionArgs, Ctx, Node>(
  nodesResolver: NodeResolver<Obj, Args, Ctx, Node>
): ConnectionResolver<Obj, Args, Ctx, Node> {
  return async (obj, args, context, info) => {
    let start = 0;
    let end: number | undefined;

    if (args.after) {
      start = cursorToOffset(args.after) + 1;
    }
    if (args.before) {
      end = cursorToOffset(args.before) - 1;
    }

    if (args.first) {
      if (args.first < 0) {
        throw new ConnectionError("When provided, 'first' must be positive");
      } else if (end == undefined || end - start + 1 > args.first) {
        end = start + args.first;
      }
    }
    if (args.last) {
      if (args.last < 0) {
        throw new ConnectionError("When provided, 'last' must be positive");
      } else if (end == undefined) {
        throw new ConnectionError(
          "Fetching 'last' nodes without either 'before' or 'first' is not supported yet"
        );
      } else if (end - start + 1 > args.last) {
        start += end - start + 1 - args.last;
      }
    }

    const options = { offset: start, limit: end ? end - start + 1 : undefined };
    const nodes = await nodesResolver(obj, options, args, context, info);
    return buildConnection(nodes, options);
  };
}
