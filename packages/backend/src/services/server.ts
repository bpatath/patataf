import env from "./env";
import logging from "./logging";
import Koa, { Middleware } from "koa";
import compose from "koa-compose";

import { getSessionMiddleware } from "./sessions";
import { getAuthenticationMiddleware } from "./auth";
import { getApolloMiddleware } from "./apollo";

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

export default class BackendServer {
  readonly bind: string;
  readonly port: number;

  private sessionModel: typeof SessionBase;
  private userModel: typeof UserBase;
  private schema: GraphQLSchema;

  private ssrMiddleware?: Middleware;

  constructor(opts: CreateBackendOptions) {
    //if (env["debug_http_delay"] > 0) {
    //  app.use((ctx, next) => {
    //    if (next) setTimeout(next, env["debug_http_delay"]);
    //  });
    //}

    //app.set("trust proxy", env["server_trusted_proxies"]);

    this.sessionModel = opts.models.Session || Session;
    this.userModel = opts.models.User || User;
    this.schema = opts.schema;

    this.port = env["server_port"];
    this.bind = env["server_bind"];
  }

  getMiddleware(app: Koa): Middleware {
    const middlewares = [
      getSessionMiddleware({ sessionModel: this.sessionModel })(app),
      getAuthenticationMiddleware({ userModel: this.userModel }),
      getApolloMiddleware({ schema: this.schema }),
    ];
    if (this.ssrMiddleware) {
      middlewares.push(this.ssrMiddleware);
    }

    return compose(middlewares);
  }

  useSSRMiddleware(middleware: Middleware): void {
    this.ssrMiddleware = middleware;
  }

  start(): void {
    const app = new Koa();
    app.use(this.getMiddleware(app));

    app.listen(this.port, this.bind, () => {
      logging.info("Server started at %s:%d", this.bind, this.port);
    });
  }
}
