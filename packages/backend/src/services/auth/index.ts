import env from "~/services/env";
import Koa, { Middleware } from "koa";
import Router from "koa-tree-router";
import compose from "koa-compose";
import passport from "koa-passport";

import addLocalAuthentication from "./local";
import getRemoteAuthentication from "./remote";
import UserModel from "~/models/user";

type AddAuthenticationOptions = {
  userModel: typeof UserModel;
};

export function getAuthenticationMiddleware(
  opts: AddAuthenticationOptions
): Middleware {
  const middlewares: Middleware[] = [];
  middlewares.push(passport.initialize());
  middlewares.push(passport.session());

  passport.serializeUser<UserModel, number>((user, done) => {
    done(null, user.id); // TODO: chekc that number/string not an issue
  });

  passport.deserializeUser<UserModel, number>(async (id, done) => {
    if (id == null) {
      return done(null);
    }
    const user = await opts.userModel.findByPk(id);
    if (user == null) {
      return done(null);
    }
    done(null, user);
  });

  const router = new Router();

  addLocalAuthentication({
    router: router,
    userModel: opts.userModel,
  });

  middlewares.push(router.mount("/auth"));

  if (env["auth_remote_enabled"]) {
    middlewares.push(
      getRemoteAuthentication({
        userModel: opts.userModel,
      })
    );
  }

  return compose(middlewares);
}
