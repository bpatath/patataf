import fs from "fs";
import ora from "ora";
import webpack from "webpack";

import paths from "./config/paths";
import clientConfig from "./config/client";
import serverConfig from "./config/server";

export default function build(): void {
  const spinner = ora();
  spinner.start("Building");
  const compiler = webpack([clientConfig, serverConfig]);
  compiler.run((err, fullStats) => {
    if (err) {
      spinner.fail("Build failed");
      console.error(err);
      process.exit(1);
    }

    const stats = fullStats.toJson();
    if (stats.errors.length) {
      spinner.fail("Build failed");
      console.error(stats.errors.join("\n"));
      process.exit(1);
    }

    if (stats.warnings.length) {
      spinner.warn("Built with warnings");
      console.log(stats.warnings.join("\n"));
    } else {
      spinner.succeed("Built");
    }

    [paths.clientStats, paths.serverStats].forEach((file, i) => {
      if (stats.children && stats.children[i]) {
        fs.writeFileSync(file, JSON.stringify(stats.children[i], null, 4), {
          encoding: "utf8",
        });
      }
    });
  });
}
