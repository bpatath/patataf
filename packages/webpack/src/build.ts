import fs from "fs";
import webpack from "webpack";

import paths from "./config/paths";
import clientConfig from "./config/client";
import serverConfig from "./config/server";
import { logStats } from "./utils";

export default function build(): void {
  //const spinner = ora();
  //spinner.start("Building");
  const compiler = webpack([clientConfig(false), serverConfig]);
  const logger = compiler.compilers.map((c) =>
    c.getInfrastructureLogger("build")
  );
  compiler.run((err, fullStats) => {
    if (err) {
      //spinner.fail("Build failed");
      console.error(err);
      process.exit(1);
    }

    logStats(compiler.compilers[0], logger[0], fullStats.stats[0]);
    logStats(compiler.compilers[1], logger[1], fullStats.stats[1]);

    if (fullStats.hasErrors()) {
      return;
    }

    const stats = fullStats.toJson();
    [paths.clientStats, paths.serverStats].forEach((file, i) => {
      if (stats.children && stats.children[i]) {
        fs.writeFileSync(file, JSON.stringify(stats.children[i], null, 4), {
          encoding: "utf8",
        });
      }
    });
  });
}
