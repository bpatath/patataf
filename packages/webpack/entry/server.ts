import Server from "@patataf/server";
import { getBackendMiddleware } from "@patataf/backend";
import { getFrontendSSRMiddleware } from "@patataf/frontend";
import frontendConfig from "../../../../src/frontend";
import backendConfig from "../../../../src/backend";

const server = new Server();
server.useBackend(getBackendMiddleware, backendConfig);
server.useFrontend(getFrontendSSRMiddleware, frontendConfig);
server.start();
