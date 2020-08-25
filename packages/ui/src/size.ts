import { Theme } from "./theme";

export type Size = "tiny" | "small" | "big" | "huge";

export function computeSize(
  theme: Theme,
  size?: Size,
  defaultValue?: Size
): string {
  switch (size || defaultValue) {
    case "tiny":
      return "0.5em";
    case "small":
      return "0.8em";
    case "big":
      return "2em";
    case "huge":
      return "5em";
    default:
      return "1em";
  }
}
