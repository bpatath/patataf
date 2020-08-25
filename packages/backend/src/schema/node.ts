import { gql } from "apollo-server-koa";
import { Model } from "sequelize-typescript";

import { InvalidIDError } from "./errors";
import { GQLContext } from "./context";

export function toGlobalId(type: string, id: number): string {
  const i = [type, String(id)].join(":");
  return Buffer.from(i, "utf8").toString("base64");
}
export function fromGlobalId(gid: string): { type: string; id: number } {
  const i = Buffer.from(gid, "base64").toString("utf8");
  const v = i.split(":", 2);
  return {
    type: v[0],
    id: parseInt(v[1]),
  };
}
export function fromGlobalIdExpectingType(
  globalId: string,
  expectedType: string
): number {
  const { type, id } = fromGlobalId(globalId);
  if (type != expectedType) {
    throw new InvalidIDError(
      `Invalid id type, got ${type} expecting ${expectedType}`
    );
  }
  return id;
}

export const GQLNode = gql`
  interface Node {
    id: ID!
  }

  extend type Query {
    node(id: ID!): Node
    nodes(ids: [ID!]!): [Node]!
  }
`;

type ModelStatic = typeof Model;
interface NodeModelStatic extends ModelStatic {
  nodeName: string;
}

export function toNodeId(obj: Model): string {
  return toGlobalId((<NodeModelStatic>obj.constructor).nodeName, obj.id);
}

type QueryNode<U> = (
  root: unknown,
  { id }: { id: string },
  context: GQLContext<U>
) => Promise<Model | null>;
type QueryNodes<U> = (
  root: unknown,
  { ids }: { ids: string[] },
  context: GQLContext<U>
) => Promise<Array<Model | null>>;
type NodeResolvers<U> = { Query: { node: QueryNode<U>; nodes: QueryNodes<U> } };

export function initNode<U>(nodeModels: NodeModelStatic[]): NodeResolvers<U> {
  function nodeFetcher(globalId: string, context: GQLContext<U>) {
    const { type, id } = fromGlobalId(globalId);
    const nodeModel = nodeModels.find((n) => n.nodeName === type);
    if (!nodeModel) {
      throw new InvalidIDError("The global id has an invalid type");
    }
    context;
    return nodeModel.findByPk(id);
  }

  const node: QueryNode<U> = async (root, { id }, context) =>
    nodeFetcher(id, context);

  const nodes: QueryNodes<U> = async (root, { ids }, context) =>
    Promise.all(ids.map((id) => nodeFetcher(id, context)));

  return {
    Query: {
      node,
      nodes,
    },
  };
}
