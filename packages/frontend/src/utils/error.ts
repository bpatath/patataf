import { ApolloError } from "@apollo/client";

export enum ErrorCode {
  UNAUTHENTICATED = "UNAUTHENTICATED",
}

/*type NetworkError = unknown;
type GraphQLError = {
  message?: string,
  path?: Array<string>,
  extensions?: {
    code?: ErrorCode,
  },
};
type Error = {
  networkError?: NetworkError,
  graphQLErrors?: Array<GraphQLError>,
};*/

export function hasError(
  errors: ApolloError | undefined,
  code: ErrorCode
): boolean {
  if (!errors) return false;
  if (!errors.graphQLErrors) return false;
  const matching = errors.graphQLErrors.filter(
    (error) => error?.extensions?.code == code
  );
  return matching.length > 0;
}
