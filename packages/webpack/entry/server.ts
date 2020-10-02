import frontend from "../../../../src/frontend";
import backend from "../../../../src/backend";
import { getSSRMiddleware } from "@patataf/frontend";

backend.useSSRMiddleware(
  getSSRMiddleware(frontend, {
    schema: backend.schema,
  })
);
backend.start();
