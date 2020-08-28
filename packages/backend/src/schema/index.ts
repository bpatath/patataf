import { gql } from "apollo-server-koa";
import { IResolvers } from "@graphql-tools/utils";
import { mergeResolvers } from "@graphql-tools/merge";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { GraphQLSchema } from "graphql";

import { GQLPageInfo } from "./connections";
import { GQLNode } from "./node";
import { GQLContext } from "./context";
import User from "~/models/user";

const baseTypeDef = gql`
  type Query {
    _empty: String
  }
  type Mutation {
    _empty: String
  }
`;

type Context = GQLContext<User>;
type Resolvers = IResolvers<unknown, Context>;
interface SchemaModule {
  typeDefs: string;
  resolvers: Resolvers;
}

export function createSchema(
  modules: SchemaModule[],
  node: Resolvers
): GraphQLSchema {
  const typeDefs = [
    baseTypeDef,
    GQLPageInfo,
    GQLNode,
    ...modules.map((m) => m.typeDefs),
  ];
  const resolvers = mergeResolvers<Context, Resolvers>([
    node,
    ...modules.map((m) => m.resolvers),
  ]);
  return makeExecutableSchema({
    typeDefs,
    resolvers,
  });
}

export const GQLRootTypeDefs = [baseTypeDef, GQLPageInfo, GQLNode];
