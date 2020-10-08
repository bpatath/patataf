# `@patataf/server`

This package provides a server for patataf applications.
It is responsible of instantiating common services (logging, config, etc.), a backend and/or a frontend.

It also provides a development server which can hold connections during recompilation, and live update the backend/frontend middleware.

## Usage

In most cases, you should not use this package directly.
It is used internally by `@patataf/webpack` which is the easiest way to develop and build a patataf application.

Refer to `@patataf/webpack` for an example on how to use it.

## TODO

- [ ] Configurable vhosts
- [ ] Configurable subpaths
