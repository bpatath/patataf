import React from "react";
import { GraphQLSchema } from "graphql";
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

  apollo?: {
    schema?: GraphQLSchema;
  };

  html: HtmlOptions;
  ssr?: boolean;
};
