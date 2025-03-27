import dev from "./development";
import prod from "./production";
import staging from "./staging";

const env =
  (process.env.NODE_ENV as "development" | "staging" | "production") ||
  "development";

const config: Record<"development" | "staging" | "production", typeof dev> = {
  development: dev,
  staging,
  production: prod,
};

export default config[env];
