#!/usr/bin/env node

import fs from "fs";
import path from "path";
import logSymbols from "log-symbols";
import commander from "commander";
import { Dockerfile, Dialect, createPatatafBaseImage } from "../index";

const program = commander.program
  .storeOptionsAsProperties(false)
  .option("--npm-client <npm|yarn>", "Select the npm client", "yarn")
  .requiredOption("--tag <tag>", "Add a tag base name.")
  .option("--app-port <port>", "Set the default server port.", "8080")
  .option("--app-workdir <wd>", "Set the default working directory.")
  .requiredOption("--app-version <vers>", "Set the image version used in tag.")
  .option(
    "--app-dialect <dialect>",
    "Set the database dialect. All dialects are built if not specified."
  )
  .option("--latest", "Add another tag corresponding to the latest version.")
  .option("-p, --push", "Push built images.")
  .option(
    "-d, --out-dir <dir>",
    "Disable building and output Dockerfiles to this directory"
  )
  .parse(process.argv)
  .opts();

const allDialects: Dialect[] = [
  "sqlite",
  "mariadb",
  "mysql",
  "postgres",
  "mssql",
];

let chosenDialects = allDialects;
if (program.dialect) {
  if (!allDialects.includes(program.dialect)) {
    console.error(`Unknown dialect, should be one of ${allDialects}`);
    process.exit(1);
  }
  chosenDialects = [program.dialect];
}

const images: Dockerfile[] = [];

async function buildImages() {
  for (const dialect of chosenDialects) {
    const image = createPatatafBaseImage({
      port: parseInt(program.appPort),
      workdir: program.appWorkdir,
      dialect,
      npmClient: program.npmClient,
    });
    images.push(image);

    const tag = `${program.tag}-${dialect}-${program.appVersion}`;
    image.tag(tag);

    if (program.outDir) {
      const dockerfilePath = path.join(program.outDir, `Dockerfile-${dialect}`);
      console.log(logSymbols.info, "Writing " + dockerfilePath);
      fs.writeFileSync(dockerfilePath, image.toString());
    } else {
      console.log(logSymbols.info, `Building: ${tag}`);
      try {
        image.build();
        console.log(logSymbols.success, `Done building ${tag}`);
      } catch (err) {
        console.error(logSymbols.error, `Failed building ${tag}`);
        if (err.pid === undefined) {
          console.error(err.message);
        }
      }
      console.log();
    }
  }
}

async function pushImages() {
  for (const image of images) {
    await image.push();
  }
}

buildImages();
if (program.push) {
  pushImages();
}
