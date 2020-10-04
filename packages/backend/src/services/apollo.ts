import { Middleware } from "koa";
import { ApolloServer } from "apollo-server-koa";
import { GraphQLSchema } from "graphql";
import context from "~/schema/context";

export function getApolloMiddleware({
  schema,
}: {
  schema: GraphQLSchema;
}): Middleware {
  const apollo = new ApolloServer({
    schema,
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
