import env from "~/services/env";
import Koa from "koa";
import Router from "koa-tree-router";
import passport from "koa-passport";
import addLocalAuthentication from "./local";
import addRemoteAuthentication from "./remote";
import UserModel from "~/models/user";

type AddAuthenticationOptions = {
  app: Koa;
  userModel: typeof UserModel;
};

export function addAuthenticationMiddleware(
  opts: AddAuthenticationOptions
): void {
  opts.app.use(passport.initialize());
  opts.app.use(passport.session());

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

  if (env["auth_remote_enabled"]) {
    addRemoteAuthentication({
      app: opts.app,
      userModel: opts.userModel,
    });
  }

  opts.app.use(router.mount("/auth"));
}
