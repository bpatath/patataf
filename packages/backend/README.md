# `@patataf/backend`

Library to build a Patataf backend.

## Models

You should use [`sequelize-typescript`]() to create your models.
Then in a separate file (e.g. `models/index.ts`), initialize your models :

```
import { initModels, User, Session } from "@patataf/backend";
import MyModel from "mymodel";

const models = {
  User,
  Session,
  MyModel
};

initModels(Object.values(models));
export default models;
```

Patataf will automatically use environment variables to configure which database to connect to.

Don't forget to create mutations for your models.

### Built-in models

Patataf exports some built-in models.
You can either use them directly, or extend the corresponding base class to add custom properties :

- `User`, `UserBase`
- `Session`, `SessionBase`

```
import { Tabel, Column } from "sequelize-typescript";
import { UserBase } from "@patataf/backend";

@Table
export default class User extends UserBase {
  @Column
  customField!: number;
}
```

## Schema

You can build your schema using [`graphql-tag`]().
A recommanded practice is to split your schema in multiple files, each exporting a typedef and a resolver :

```
import gql from "graphql-tag";

export const GQLMyType = gql`
  type MyType {
    foo: number
  }

  extend type Query {
    mytype: MyType
  };
`;

export const GQLMyTypeResolvers = {
  MyType: {
    id: (mymodel: MyModel) => mymodel.foo
  },
  Query: {
    mytype: () => MyModel.findByPk(1)
  }
};
```

Then in another file (e.g. `schema/index.ts`), make the schema :

```
import { GQLRootTypeDefs } from "@patataf/backend";
import { makeExecutableSchema, mergeResolvers } from "graphql-tools";

import { GQLMyType, GQLMyTypeResolvers } from "./mytype";

const typeDefs = [
  ...GQLRootTypeDefs,
  GQLMyType,
];
const resolvers = mergeResolvers([
  GQLMyTypeResolvers,
]);

export default makeExecutableSchema({ typeDefs, resolvers });
```

Notice that you have to include the built-in `GQLRootTypeDefs`.

### Node

### Connections

## Server

You can then start the backend server using :

```
import { startBackendServer } from "@patataf/backend";
import schema from "./schema";
import models from "./models";

startBackendServer({
  schema,
  userModel: models.User,
  sessionModel: models.Session
)};
```

## Configuration

App configuration is automatically managed by Patataf using environment variables and dotenv file.
You should copy the `.env.defaults` and `.env.types` to your project.
When deploying your app, one can add a `.env` file to override the defaults,
or directly set environment variables to override all dotenv files.
