import Koa from "koa";
import { ApolloServer } from "apollo-server-koa";
import { GraphQLSchema } from "graphql";
import context from "~/schema/context";

export type AddApolloMiddlewareOptions = {
  app: Koa;
  schema: GraphQLSchema;
};

export function addApolloMiddleware(opts: AddApolloMiddlewareOptions): void {
  const apollo = new ApolloServer({
    schema: opts.schema,
    context,
    playground: {
      settings: {
        "request.credentials": "include",
      },
    },
  });

  apollo.applyMiddleware({
    app: opts.app,
    cors: {
      credentials: true,
    },
  });
}
