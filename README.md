# @the-devoyage/sequelize-query-generator

Instantly add advanced filtering, pagination, and statistical querying to restful or GraphQL APIs with Shared Filters provided by Sequelize Query Generator.

This library converts standardized network requests into usable Sequelize filters allowing you to streamline the development of your API while providing advanced options to the client. 

```js
// My API
import { GenerateSQL } from "@the-devoyage/sequelize-query-generator";

const getUsers = async (req, res) => {
const findOptions = GenerateSQL(req.body)

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
const paginatedResponse = await findAndPaginate({
  model: UsersModel,
  findOptions,
  filterConfig
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

Returns optional stats about the query along with historic stats for every query. Incredibly useful for creating charts.


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
      new FieldFilter().int(2).filterBy("EQ").operator("OR").run(),
      new FieldFilter().int(5).filterBy("LT").operator("OR").run()
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

