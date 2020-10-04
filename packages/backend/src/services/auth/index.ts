import { Middleware } from "koa";
import compose from "koa-compose";
import passport from "koa-passport";

import { Models } from "~/config";
import UserModel from "~/models/user";

export function getAuthenticationMiddleware({
  models,
}: {
  models: Models;
}): Middleware {
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
    const user = await models.User.findByPk(id);
    if (user == null) {
      return done(null);
    }
    done(null, user);
  });

  return compose(middlewares);
}
