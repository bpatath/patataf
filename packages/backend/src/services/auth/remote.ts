import env from "../env";
import logging from "../logging";

import Koa from "koa";
import passport from "koa-passport";
import { Strategy, VerifyCallback } from "passport-custom";
import UserModel from "~/models/user";

type AddRemoteAuthenticationOptions = {
  app: Koa;
  userModel: typeof UserModel;
};

export default (opts: AddRemoteAuthenticationOptions): void => {
  const remoteVerify: VerifyCallback = async (req, done) => {
    try {
      /*const trust = req.app.get("trust proxy fn");
      if (!trust(req.connection.remoteAddress)) {
        return done("Connection outside reverse proxy");
      }*/

      const username = req.get(env["auth_remote_header"].toLowerCase());
      if (!username) {
        return done("Missing header in remote authentication");
      }
      const user = await opts.userModel.login({ username, autocreate: true });
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
  opts.app.use(passport.authenticate("remote", { session: false }));

  logging.info(
    "Enabled remote authentication using header: " + env["auth_remote_header"]
  );
};
