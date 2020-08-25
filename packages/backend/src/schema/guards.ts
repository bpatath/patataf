import { AuthenticationError, UserInputError } from "apollo-server-koa";
import { ValidationError } from "sequelize";
import { NotFoundError, ErrorProps } from "./errors";
import { UserBase } from "~/models/user";

export function authenticationGuard<U>(user: U | null): asserts user is U {
  if (user == null) {
    throw new AuthenticationError("You must be logged in");
  }
}

export function notFoundGuard<O>(
  object: O | null,
  message: string,
  additionalProps: ErrorProps = {}
): asserts object is O {
  if (object === null) {
    throw new NotFoundError(message, additionalProps);
  }
}

interface OwnedModel {
  ownerId: number;
}

export function ownerGuard<U extends UserBase>(
  object: OwnedModel,
  user: U,
  message: string,
  additionalProps: ErrorProps = {}
): void {
  if (object.ownerId !== user.id) {
    throw new NotFoundError(message, additionalProps);
  }
}

export function handleSequelizeError(exception: Error): void {
  if (exception instanceof ValidationError) {
    throw new UserInputError("Invalid input", {
      errors: exception.errors.map((error) => ({
        message: error.message,
        path: error.path,
        //validator: error.validatorName,
      })),
    });
  }

  throw exception;
}
