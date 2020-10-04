import { Middleware } from "koa";
import passport from "koa-passport";
import { Strategy, VerifyCallback } from "passport-custom";
import { Logger } from "winston";

import { RootConfig, Models } from "~/config";

export function getRemoteAuthMiddleware({
  models,
  rootConfig,
  logger,
}: {
  models: Models;
  rootConfig: RootConfig;
  logger: Logger;
}): Middleware {
  const remoteVerify: VerifyCallback = async (req, done) => {
    try {
      /*const trust = req.app.get("trust proxy fn");
      if (!trust(req.connection.remoteAddress)) {
        return done("Connection outside reverse proxy");
      }*/

      const username = req.get(rootConfig["auth_remote_header"].toLowerCase());
      if (!username) {
        return done("Missing header in remote authentication");
      }
      const user = await models.User.login({ username, autocreate: true });
      if (user) {
        done(null, user);
      } else {
        done("Invalid credentials", false);
      }
    } catch (err) {
      done(err);
    }
  };
  passport.use("remote", new Strategy(remoteVerify));
  const middleware = passport.authenticate("remote", { session: false });

  logger.info(
    "Enabled remote authentication using header: " +
      rootConfig["auth_remote_header"]
  );

  return middleware;
}
