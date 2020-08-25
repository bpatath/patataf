import path from "path";

export default {
  config: path.resolve(__dirname, "..", "services", "database.js"),
  "models-path": path.resolve("build", "models"),
  "seeders-path": path.resolve("build", "seeders"),
  "migrations-path": path.resolve("build", "migrations"),
};
