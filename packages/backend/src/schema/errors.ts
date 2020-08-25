import { ApolloError } from "apollo-server-koa";

enum ErrorCode {
  INVALID_ID = "INVALID_ID",
  NOT_FOUND = "NOT_FOUND",
  ALREADY_IN_ARRAY = "ALREADY_IN_ARRAY",
}
export interface ErrorProps {} // eslint-disable-line @typescript-eslint/no-empty-interface

export class InvalidIDError extends ApolloError {
  constructor(message: string, additionalProps: ErrorProps = {}) {
    super(message, ErrorCode.INVALID_ID, additionalProps);
  }
}

export class NotFoundError extends ApolloError {
  constructor(message: string, additionalProps: ErrorProps = {}) {
    super(message, ErrorCode.NOT_FOUND, additionalProps);
  }
}

export class AlreadyInArrayError extends ApolloError {
  constructor(message: string, additionalProps: ErrorProps = {}) {
    super(message, ErrorCode.ALREADY_IN_ARRAY, additionalProps);
  }
}
