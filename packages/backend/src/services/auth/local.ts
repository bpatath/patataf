import env from "../env";
import logging from "../logging";

import Koa from "koa";
import Router from "koa-tree-router";
import bodyParser from "koa-bodyparser";
import cors from "@koa/cors";

import passport from "koa-passport";
import { Strategy, VerifyFunction } from "passport-local";
import UserModel from "~/models/user";

type AddLocalAuthenticationOptions = {
  router: Router<unknown, Koa.Context>;
  userModel: typeof UserModel;
};

export default (opts: AddLocalAuthenticationOptions): void => {
  const localVerify: VerifyFunction = async (username, password, done) => {
    try {
      const user = await opts.userModel.login({ username, password });
      if (user) {
        done(null, user);
      } else {
        done(null, false, { message: "Invalid credentials" });
      }
    } catch (err) {
      done(err);
    }
  };
  passport.use(new Strategy(localVerify));

  const corsMiddleware = cors({
    origin: env["auth_frontend_url"],
    credentials: true,
  });

  opts.router.options("/local/login", corsMiddleware);
  opts.router.post(
    "/local/login",
    corsMiddleware,
    bodyParser(),
    passport.authenticate("local")
  );

  opts.router.options("/local/logout", corsMiddleware);
  opts.router.post(
    "/local/logout",
    corsMiddleware,
    bodyParser(),
    (ctx: Koa.Context) => ctx.logout()
  );

  logging.info(
    "Enabled local authentication for origin: " + env["auth_frontend_url"]
  );
};
