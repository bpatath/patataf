import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  NormalizedCacheObject,
} from "@apollo/client";
import { SchemaLink } from "@apollo/client/link/schema";
import { GraphQLSchema } from "graphql";

declare global {
  interface Window {
    __APOLLO_STATE__?: NormalizedCacheObject;
  }
}

export type ApolloOptions = {
  schema?: GraphQLSchema;
  ssr?: boolean;
  ssrRole: "client" | "server";
};

export default function createApolloClient(
  options: ApolloOptions
): ApolloClient<NormalizedCacheObject> {
  const cache = new InMemoryCache();
  if (options.ssr && window && window.__APOLLO_STATE__) {
    cache.restore(window.__APOLLO_STATE__);
  }

  let link;
  if (options.schema) {
    link = new SchemaLink({ schema: options.schema });
  } else {
    link = new HttpLink({
      uri: process.env.REACT_APP_BACKEND_URI + "/graphql",
      credentials: "include",
    });
  }

  const ssrForceFetchDelay =
    options.ssr && options.ssrRole == "client" ? 100 : undefined;
  const ssrMode = options.ssr && options.ssrRole == "server";

  return new ApolloClient({
    cache,
    link,
    ssrForceFetchDelay,
    ssrMode,
  });
}
