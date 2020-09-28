import { Middleware } from "koa";
import { ApolloServer } from "apollo-server-koa";
import { GraphQLSchema } from "graphql";
import context from "~/schema/context";

export type AddApolloMiddlewareOptions = {
  schema: GraphQLSchema;
};

export function getApolloMiddleware(
  opts: AddApolloMiddlewareOptions
): Middleware {
  const apollo = new ApolloServer({
    schema: opts.schema,
    context,
    playground: {
      settings: {
        "request.credentials": "include",
      },
    },
  });

  return apollo.getMiddleware({
    cors: {
      credentials: true,
    },
  });
}
