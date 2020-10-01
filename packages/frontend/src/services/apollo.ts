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

export function createApolloClient(): ApolloClient<NormalizedCacheObject> {
  const cache = new InMemoryCache();
  if (process.env.SSR && window && window.__APOLLO_STATE__) {
    cache.restore(window.__APOLLO_STATE__);
  }

  const link = new HttpLink({
    uri: process.env.REACT_APP_BACKEND_URI + "/graphql",
    credentials: "include",
  });

  const ssrForceFetchDelay = process.env.SSR ? 100 : undefined;
  return new ApolloClient({
    cache,
    link,
    ssrForceFetchDelay,
  });
}

export function createApolloClientSSR(
  schema: GraphQLSchema
): ApolloClient<NormalizedCacheObject> {
  const cache = new InMemoryCache();
  const link = new SchemaLink({ schema });
  return new ApolloClient({
    cache,
    link,
    ssrMode: true,
  });
}
