# `@patataf/docker`

Module and CLI to build and publish docker images for patataf apps.

- Compatible with `@patataf/webpack` output configuration.
- Build one image per dialect.
- Default env configuration compatible with Docker

## Usage

```
yarn add --dev @patataf/docker
```

Add an alias in your `package.json`:

```
"scripts": {
  "docker": "pf-docker --tag myapp
}
```

Build your image locally, and then build the docker images:

```
yarn docker [options...]
```

## Options

- `--app-version`, required, used to create the tag `myapp-dialect-version`.
- `--app-port`, specify the default port the server will listen to (default 8080).
- `--app-workidr`, specify the working directory of the app.
- `--app-dialect`, specify the dialect to build. If not specified, all dialects are built.
- `--npm-client`, choose between `npm` or `yarn` as the npm client. Note that it should correspond to the client you're using locally, and a `package-lock.json` or `yarn.lock` should be available.
- `-p --push`, push the built images
- `-d --out-dir`, do not build or publish images, but output the Dockerfiles to the specified directory instead.
