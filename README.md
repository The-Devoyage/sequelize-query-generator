# @the-devoyage/sequelize-query-generator

Instantly add advanced filtering, pagination, and statistical query to any API.

```js
import { GenerateSQL } from "@the-devoyage/sequelize-query-generator";

const findOptions = GenerateSQL(req.body)

const users = await User.findAll(findOptions);
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
