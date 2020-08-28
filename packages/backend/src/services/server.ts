import env from "./env";
import logging from "./logging";
import Koa from "koa";

import { addSessionMiddleware } from "./sessions";
import { addAuthenticationMiddleware } from "./auth";
import { addApolloMiddleware } from "./apollo";

import { GraphQLSchema } from "graphql";
import User, { UserBase } from "~/models/user";
import Session, { SessionBase } from "~/models/session";

interface Models {
  User?: typeof UserBase;
  Session?: typeof SessionBase;
}

export type CreateBackendOptions = {
  schema: GraphQLSchema;
  models: Models;
};

export default class Backend {
  private app: Koa;

  constructor(opts: CreateBackendOptions) {
    const app = new Koa();

    if (env["debug_http_delay"] > 0) {
      app.use((ctx, next) => {
        if (next) setTimeout(next, env["debug_http_delay"]);
      });
    }

    //app.set("trust proxy", env["server_trusted_proxies"]);

    addSessionMiddleware({
      app,
      sessionModel: opts.models.Session || Session,
    });
    addAuthenticationMiddleware({
      app,
      userModel: opts.models.User || User,
    });
    addApolloMiddleware({
      app,
      schema: opts.schema,
    });

    this.app = app;
  }

  start(): void {
    this.app.listen(env["server_port"], env["server_bind"], () => {
      logging.info(
        "Server started at %s:%d",
        env["server_bind"],
        env["server_port"]
      );
    });
  }
}
