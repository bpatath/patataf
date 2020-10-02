import { getSSRMiddleware } from "@patataf/frontend";
import backend from "../../../../src/backend";
import frontendConfig from "../../../../src/frontend";

const ssrMiddleware = getSSRMiddleware(frontendConfig, {
  schema: backend.schema,
});

backend.setSSRMiddleware(ssrMiddleware);

export default backend;
