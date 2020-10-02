BABEL_OPTS=--extensions .ts,.tsx --delete-dir-on-start --config-file ../../.babelrc.js 

build-webpack:
	cd packages/webpack && BABEL_ENV=es5 babel ${BABEL_OPTS} -d lib src

build-backend:
	cd packages/backend && BABEL_ENV=es5 babel ${BABEL_OPTS} -d lib/es5 src
	cd packages/backend && BABEL_ENV=modules babel ${BABEL_OPTS} -d lib/modules src

build-frontend:
	cd packages/frontend && BABEL_ENV=es5 babel ${BABEL_OPTS} -d lib/es5 src
	cd packages/frontend && BABEL_ENV=modules babel ${BABEL_OPTS} -d lib/modules src

build-ui:
	cd packages/ui && BABEL_ENV=es5 babel ${BABEL_OPTS} -d lib/es5 src
	cd packages/ui && BABEL_ENV=modules babel ${BABEL_OPTS} -d lib/modules src

build-server:
	cd packages/server && BABEL_ENV=es5 babel ${BABEL_OPTS} -d lib src

build: build-webpack build-backend build-frontend build-ui build-server
