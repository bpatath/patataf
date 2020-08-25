import { AuthResultAction } from "./auth";
import { APIProgressAction } from "./progress";

export type Action = AuthResultAction | APIProgressAction;
