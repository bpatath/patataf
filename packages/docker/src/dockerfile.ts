import { execSync } from "child_process";

type LineContent = {
  type: "line";
  line: string;
};

type SwitchCallback = (val: string, df: Dockerfile) => void;
type SwitchContent = {
  type: "switch";
  name: string;
  cb: SwitchCallback;
};

type Content = LineContent | SwitchContent;

export default class Dockerfile {
  private content: Content[];
  private tags: string[];

  constructor() {
    this.content = [];
    this.tags = [];
  }

  /* Create the Dockerfile */

  private pushLine(line: string): Dockerfile {
    this.content.push({ type: "line", line });
    return this;
  }

  from(base: string): Dockerfile {
    return this.pushLine(`FROM ${base}`);
  }

  workdir(path: string): Dockerfile {
    return this.pushLine(`WORKDIR ${path}`);
  }

  environment(
    name: string,
    defaultValue?: string | number | boolean
  ): Dockerfile {
    if (defaultValue === undefined) {
      return this.pushLine(`ENV ${name.toUpperCase()}`);
    } else {
      const defaultValueStr = String(defaultValue);
      return this.pushLine(`ENV ${name.toUpperCase()}=${defaultValueStr}`);
    }
  }

  user(username: string, groupname?: string): Dockerfile {
    const df = this.pushLine(`USER ${username}`);
    if (groupname) {
      return df.group(groupname);
    }
    return df;
  }

  group(groupname: string): Dockerfile {
    return this.pushLine(`GROUP ${groupname}`);
  }

  copy(src: string | string[], dst: string): Dockerfile {
    const srcFull = Array.isArray(src) ? src.join(" ") : src;
    return this.pushLine(`COPY ${srcFull} ${dst}`);
  }

  expose(port: number): Dockerfile {
    return this.pushLine(`EXPOSE ${port.toString()}`);
  }

  volume(path: string): Dockerfile {
    return this.pushLine(`VOLUME ${path}`);
  }

  entrypoint(path: string): Dockerfile {
    return this.pushLine(`ENTRYPOINT ${path}`);
  }

  command(cmd: string | string[]): Dockerfile {
    const cmdFull = Array.isArray(cmd) ? cmd.join(" ") : cmd;
    return this.pushLine(`CMD ${cmdFull}`);
  }

  run(cmd: string | string[]): Dockerfile {
    const cmdFull = Array.isArray(cmd) ? cmd.join(" && \\\n  ") : cmd;
    return this.pushLine(`RUN ${cmdFull}`);
  }

  /* Build and publish */

  toString(): string {
    let body = "";
    this.content.forEach((content) => {
      if (content.type == "line") {
        body += content.line + "\n";
      }
    });
    return body;
  }

  tag(...tagParts: string[]): void {
    this.tags.push(tagParts.join("-"));
  }

  build(): void {
    const tags = this.tags.map((tag) => `-t ${tag}`).join(" ");
    execSync(`docker build ${tags} -f - .`, {
      input: this.toString(),
      stdio: [undefined, 1, 2],
    });
  }

  push(): void {
    this.tags.forEach((tag) => {
      execSync(`docker push ${tag}`);
    });
  }
}
