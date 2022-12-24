# @the-devoyage/sequelize-query-generator

Instantly add advanced filtering, pagination, and statistical querying to restful or GraphQL APIs with Shared Filters provided by Sequelize Query Generator. This library converts standardized network requests into usable Sequelize filters allowing you to streamline the development of your API while providing advanced options to the client. 

Oh, and it's done with as little as 3 lines of code.

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

Specify nested and/or queries, grouped queries, and standardized filtering options for strings, numbers, booleans, and dates.

### Pagination

Built in by default, options are provided to control cursor based pagination.

### Statistical Data

Returns optional stats about the query along with historic stats for every query. Incredibly useful for creating charts.
