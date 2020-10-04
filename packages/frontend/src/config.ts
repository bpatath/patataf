import React from "react";
import { Theme } from "@patataf/ui";
import { HtmlOptions } from "~/html";

export type Config = {
  app: React.ComponentType;
  components?: {
    login?: Node;
    landing?: Node;
  };
  theme: Theme;

  redux?: {
    reducers?: Record<string, unknown>;
  };

  html: HtmlOptions;
};
