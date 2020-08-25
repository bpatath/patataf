import { useContext } from "react";
import { ConfigContext } from "~/components/App";
import { Config } from "~/config";

export default function useConfig(): Config {
  const config = useContext(ConfigContext);
  if (!config) {
    // Should never happen since Patataf encapsulates the app with a config provider
    throw new Error("useConfig hooks called without a config provider");
  }
  return config;
}
