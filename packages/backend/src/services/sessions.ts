import logging from "./logging";
import Koa from "koa";
import session, { Session } from "koa-session";
import SessionBase from "~/models/session";

export type AddSessionMiddlewareOptions = {
  app: Koa;
  sessionModel: typeof SessionBase;
};
export function addSessionMiddleware(opts: AddSessionMiddlewareOptions): void {
  async function get(key: string) {
    const session = await SessionBase.findByPk(key);
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
    const session = await SessionBase.findByPk(key);
    const expires =
      maxAge != "session" ? new Date(new Date().getTime() + maxAge) : null;
    if (session) {
      session.update({ data: JSON.stringify(sess), expires });
    } else {
      SessionBase.create({ id: key, data: JSON.stringify(sess), expires });
    }
  }

  async function destroy(key: string) {
    const session = await SessionBase.findByPk(key);
    if (session) {
      await session.destroy();
    }
  }

  opts.app.use(
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
      opts.app
    )
  );
}
