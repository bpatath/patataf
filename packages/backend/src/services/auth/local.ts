import Koa from "koa";
import Router from "koa-tree-router";
import bodyParser from "koa-bodyparser";
import cors from "@koa/cors";
import { Logger } from "winston";
import passport from "koa-passport";
import { Strategy, VerifyFunction } from "passport-local";

import { RootConfig, Models } from "~/config";

export function getLocalAuthMiddleware({
  rootConfig,
  models,
  logger,
  router,
}: {
  rootConfig: RootConfig;
  models: Models;
  logger: Logger;
  router: Router;
}): void {
  const localVerify: VerifyFunction = async (username, password, done) => {
    try {
      const user = await models.User.login({ username, password });
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
    origin: rootConfig["auth_frontend_url"],
    credentials: true,
  });

  router.options("/local/login", corsMiddleware);
  router.post(
    "/local/login",
    corsMiddleware,
    bodyParser(),
    passport.authenticate("local")
  );

  router.options("/local/logout", corsMiddleware);
  router.post(
    "/local/logout",
    corsMiddleware,
    bodyParser(),
    (ctx: Koa.Context) => ctx.logout()
  );

  logger.info(
    "Enabled local authentication for origin: " +
      rootConfig["auth_frontend_url"]
  );
}
