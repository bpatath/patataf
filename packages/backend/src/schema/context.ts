import Koa from "koa";
import "koa-passport";

export interface GQLContext<U> {
  user: U | null;
}

export default function context<U>({
  ctx,
}: {
  ctx: Koa.Context;
}): GQLContext<U> {
  return {
    user: ctx.state.user,
  };
}
