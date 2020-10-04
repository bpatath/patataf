import { Logger } from "winston";
import Koa, { Middleware } from "koa";
import session, { Session } from "koa-session";

import { Models } from "~/config";

export function getSessionMiddleware({
  models,
  logger,
  app,
}: {
  models: Models;
  logger: Logger;
  app: Koa;
}): Middleware {
  async function get(key: string) {
    const session = await models.Session.findByPk(key);
    if (!session) {
      return null;
    }
    if (session.expires && session.expires <= new Date()) {
      session.destroy();
      return null;
    }
    try {
      return JSON.parse(session.data);
    } catch (err) {
      logger.error("Error while parsing session data:", err);
    }
  }

  async function set(key: string, sess: Session, maxAge: number | "session") {
    const session = await models.Session.findByPk(key);
    const expires =
      maxAge != "session" ? new Date(new Date().getTime() + maxAge) : null;
    if (session) {
      session.update({ data: JSON.stringify(sess), expires });
    } else {
      models.Session.create({
        id: key,
        data: JSON.stringify(sess),
        expires,
      });
    }
  }

  async function destroy(key: string) {
    const session = await models.Session.findByPk(key);
    if (session) {
      await session.destroy();
    }
  }

  return session(
    {
      key: "patataf.session",
      httpOnly: true,
      secure: true,
      store: {
        get,
        set,
        destroy,
      },
    },
    app
  );
}
