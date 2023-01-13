# @the-devoyage/sequelize-query-generator

Instantly add advanced filtering, pagination, and statistical querying to restful or GraphQL APIs with Shared Filters provided by Sequelize Query Generator.

This library converts standardized network requests into usable Sequelize filters allowing you to streamline the development of your API while providing advanced options to the client. 

```js
// My API
import { GenerateSequelize } from "@the-devoyage/sequelize-query-generator";

const getUsers = async (req, res) => {
  const findOptions = GenerateSequelize(req.body)

  const users = await User.findAll(findOptions);

  res.json(users);
};
```

## Features

### Sequeilze Generation

Instantly convert network request shaped with `@the-devoyage/request-filter-language` into Sequelize `FindOptions` objects.

### Advanced Filtering

Specify **nested** and/or queries, **grouped** queries, and standardized filtering options for strings, numbers, booleans, and dates. Advanced filtering for the client without the headache.

- Or Clauses - Find users who have a `first name = Bongo -or- age = 10`.

```
const users = getUsers({
  name: new fieldFilter().string("Bongo").operator("OR").run(),
  age: new fieldFilter().int(10).filterBy("EQ").run(),
});
```

- And Clauses - Find users who have a `first name = Bongo -or- age = 25` - or - `petName = "Oakley"`.

```
const users = getUsers({
  name: new fieldFilter().string("Bongo")
    .operator("OR")
    .run(),
  age: new fieldFilter().int(25)
    .filterBy("EQ")
    .run(),
  petName: new fieldFilter().string("Oakley")
    .run(),
});
```

- Custom Groupings - Find users who have a `first name = Bongo -or- age = 25` - or - `petName = "Oakley" -and- petAge < 11`.

```
const users = getUsers({
  name: new fieldFilter().string("Bongo")
    .operator("OR")
    .groups(["user.or"])
    .run(),
  age: new fieldFilter().int(25)
    .operator("OR")
    .filterBy("EQ")
    .groups(["user.or"])
    .run(),
  petName: new fieldFilter().string("Oakley")
    .operator("OR")
    .groups(["pet.and"])
    .run(),
  petAge: new fieldFilter()
    .int(11)
    .operator("LT")
    .groups(["pet.and"])
    .run(),
});
```

### Find and Paginate

Use the `FindAndPaginate` method to quickly get paginated results with statistical data.

```js
const paginatedResponse = await FindAndPaginate({
  model: UsersModel, // Sequelize Model
  findOptions, // Sequelize Find Options
  filterConfig // Configuration Options
});
```

Returns:

```js 
{
  data: [
    {
      _id: 1,
      name: "Bongo",
      age: 9,
    },
    {
      _id: 2,
      name: "Oakley",
      age: 4,
    },
  ],
  stats: {
    remaining: 10,
    total: 12,
    page: 1,
    cursor: "2022-09-03T00:45:17.245Z",
  };
}
```

### Statistical Data

Returns basic statistical data such as total counts, cursors, remaining counts, and current page. 

In addition it returns optional historical stats, which is data that is organized into time periods so that you can easily create charts and graphs based on specified date objects.

```js
{
  "data": {
    "getDogs": {
      "stats": {
        "total": 126,
        "cursor": "2022-05-04T15:45:22.000Z",
        "remaining": 121,
        "page": 1,
        "history": [
          {
            "_id": {
              "YEAR": 2022,
              "MONTH": 1
            },
            "total": 14
          },
          {
            "_id": {
              "YEAR": 2022,
              "MONTH": 2
            },
            "total": 18
          },
          {
            "_id": {
              "YEAR": 2022,
              "MONTH": 3
            },
            "total": 7
          },
          {
            "_id": {
              "YEAR": 2022,
              "MONTH": 4
            },
            "total": 1
          },
          {
            "_id": {
              "YEAR": 2022,
              "MONTH": 5
            },
            "total": 10
          },
          {
            "_id": {
              "YEAR": 2022,
              "MONTH": 6
            },
            "total": 12
          },
          {
            "_id": {
              "YEAR": 2022,
              "MONTH": 7
            },
            "total": 48
          },
          {
            "_id": {
              "YEAR": 2022,
              "MONTH": 9
            },
            "total": 8
          },
          {
            "_id": {
              "YEAR": 2022,
              "MONTH": 10
            },
            "total": 5
          },
          {
            "_id": {
              "YEAR": 2022,
              "MONTH": 11
            },
            "total": 1
          },
          {
            "_id": {
              "YEAR": 2022,
              "MONTH": 12
            },
            "total": 2
          }
        ]
      }
    }
  }
}
```

### Easy Queries

Standardize the way that the client requests data from the API and easily write queries with the library `@the-devoyage/request-filter-language`.

The following query returns accounts that:
- Have email field that contains the string "nick" 
**AND** 
- Has a role of either equal to 5 or less than 2.

**GraphQL Example**

Field Filters written with `@the-devoyage/request-filter-langauge`.

```js
import { fieldFilter } from "@the-devoyage/request-filter-language";

const { data } = useQuery(GET_ACCOUNTS, {
  variables: {
    email: new fieldFilter().string("Bongo").operator("AND").filterBy("REGEX").run(),
    role: [
      new FieldFilter().int(2)
        .filterBy("EQ")
        .operator("OR")
        .run(),
      new FieldFilter().int(5)
        .filterBy("LT")
        .operator("OR")
        .run()
    ],
  },
});
```

**REST Example**

Field Filters written out in object form.

```ts
const response = await fetch("/api/accounts", {
  method: "GET",
  body: JSON.stringify({
    email: { filterBy: "REGEX", string: "nick", operator: "AND" },
    role: [
      { filterBy: "EQ", int: 5, operator: "OR" },
      { filterBy: "LT", int: 2, operator: "OR" },
    ],
  }),
});
```

## Install

1. Login to the github registry with your github account.

```
npm login --registry=https://npm.pkg.github.com
```

2. In the root of the target project, add the following to the `.npmrc` file to tell this package where to be downloaded from.

```
@the-devoyage:registry=https://npm.pkg.github.com
```

3. Install

```
npm install @the-devoyage/sequelize-query-generator
```


## Setup

### 1. Import Types, Resolvers, and Scalars

GraphQL:

First, add the MFG `typeDefs` and `resolvers` to the schema from the `@the-devoyage/request-filter-language` library.

```ts
import { GraphQL } from "@the-devoyage/request-filter-language";

const server = new ApolloServer({
  typeDefs: [typeDefs, GraphQL.typeDefs],
  resolvers: [resolvers, GraphQL.resolvers],
});
```

ExpressJS:

No action needed to initiate filters.

### 2. Use the Typings

The Field Filter Types shape the expected request which will enter the server.

GraphQL Example

Add Field Filters as Input Property Types

```ts
export const typeDefs = `
  type Account {
    _id: ObjectID!
    createdAt: DateTime! 
    email: String!
    role: Int!
    users: [User!]!
    nested_details: NestedDetails!
  }

  type User {
    _id: ObjectID!
  }

  type NestedDetails {
    age: Int!
    married: Boolean!
  }

  input GetAccountsInput {
    _id: StringFieldFilter
    users: StringFieldFilter
    email: StringFieldFilter
    role: [IntFieldFilter] # Arrays Accepted
    nested_details: NestedDetailsInput # Nested Objects are Valid
  }

  input NestedDetailsInput {
    age: IntFieldFilter
    married: BooleanFieldFilter
  }

  type GetAccountsResponse {
    stats: Stats
    data: [Account]
  }

  type Query {
    getAccounts(getAccountsInput: GetAccountsInput): GetAccountsResponse!
  }
`;
```

Express Example

With express you do not need to tell the server about every single detail. You can simply define a type for incoming request.body and use it within your routes.

```ts
import {
  StringFieldFilter,
  IntFieldFilter,
  FilterConfig,
} from "@the-devoyage/request-filter-language";

interface RequestBody {
  _id?: StringFieldFilter;
  name?: StringFieldFilter;
  breed?: StringFieldFilter;
  age?: IntFieldFilter;
  favoriteFoods?: StringFieldFilter;
  createdAt?: StringFieldFilter;
  config?: FilterConfig;
}
```

### 3. Generate Sequelize

Use the `GenerateSequelize` function to convert the typed request to Sequelize Find Options.

Graphql Example:

```ts
// Resolvers.ts
import { GenerateSequelize } from "@the-devoyage/sequelize-query-generator";

export const Query: QueryResolvers = {
  getAccounts: async (_, args) => {
    const findOptions = GenerateSequelize({
      fieldFilters: args.getAllUsersInput,
      filterConfig: args.filterConfig,
    });

    const accounts = await Account.find(findOptions);

    return accounts;
  },
};
```

Express JS Example

```ts
app.get("/", (req, res) => {
  const findOptions = GenerateSequelize({
    fieldFilters: req.body,
    filterConfig: req.body.config,
  });

  const dogs = await Dog.find(findOptions);

  res.json(dogs);
});
```

### 4. Find and Paginate

Use the generated `findOptions` object, returned from the `GenerateSequelize` method, with the provided find and paginate function.

```ts
import { GenerateSequelize, FindAndPaginate } from "@the-devoyage/sequelize-query-generator";

const Query = {
  getAccounts: async (_, args) => {
    const findOptions = GenerateSequelize<IAccount>({
      fieldFilters: args.getAccountsInput,
      filterConfig: args.filterConfig
    });

    const { data, stats } = await findAndPaginate(
      AccountsModel,
      findOptions,
      filterConfig: args.filterConfig
    );

    return { data, stats };
  },
};
```

