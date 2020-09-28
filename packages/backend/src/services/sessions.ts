import logging from "./logging";
import Koa, { Middleware } from "koa";
import session, { Session } from "koa-session";
import SessionBase from "~/models/session";

export type AddSessionMiddlewareOptions = {
  sessionModel: typeof SessionBase;
};
export function getSessionMiddleware(
  opts: AddSessionMiddlewareOptions
): (Koa) => Middleware {
  async function get(key: string) {
    const session = await opts.sessionModel.findByPk(key);
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
      logging.error("Error while parsing session data:", err);
    }
  }

  async function set(key: string, sess: Session, maxAge: number | "session") {
    const session = await opts.sessionModel.findByPk(key);
    const expires =
      maxAge != "session" ? new Date(new Date().getTime() + maxAge) : null;
    if (session) {
      session.update({ data: JSON.stringify(sess), expires });
    } else {
      opts.sessionModel.create({
        id: key,
        data: JSON.stringify(sess),
        expires,
      });
    }
  }

  async function destroy(key: string) {
    const session = await opts.sessionModel.findByPk(key);
    if (session) {
      await session.destroy();
    }
  }

  return (app: Koa) =>
    session(
      {
        key: "poaf.session",
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
