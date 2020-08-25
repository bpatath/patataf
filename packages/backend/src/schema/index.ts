import { gql } from "apollo-server-koa";
import { GQLPageInfo } from "./connections";
import { GQLNode } from "./node";

const baseTypeDef = gql`
  type Query {
    _empty: String
  }
  type Mutation {
    _empty: String
  }
`;

export const GQLRootTypeDefs = [baseTypeDef, GQLPageInfo, GQLNode];
