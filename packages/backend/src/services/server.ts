import env from "./env";
import logging from "./logging";
import Koa from "koa";

import { addSessionMiddleware } from "./sessions";
import { addAuthenticationMiddleware } from "./auth";
import { addApolloMiddleware } from "./apollo";

import { GraphQLSchema } from "graphql";
import UserBase from "~/models/user";
import SessionBase from "~/models/session";

export type CreateBackendOptions = {
  schema: GraphQLSchema;
  userModel: typeof UserBase;
  sessionModel: typeof SessionBase;
};

export function startBackendServer(opts: CreateBackendOptions): void {
  const app = new Koa();

  if (env["debug_http_delay"] > 0) {
    app.use((ctx, next) => {
      if (next) setTimeout(next, env["debug_http_delay"]);
    });
  }

  //app.set("trust proxy", env["server_trusted_proxies"]);

  addSessionMiddleware({
    app,
    sessionModel: opts.sessionModel,
  });
  addAuthenticationMiddleware({
    app,
    userModel: opts.userModel,
  });
  addApolloMiddleware({
    app,
    schema: opts.schema,
  });

  app.listen(env["server_port"], env["server_bind"], () => {
    logging.info(
      "Server started at %s:%d",
      env["server_bind"],
      env["server_port"]
    );
  });
}
