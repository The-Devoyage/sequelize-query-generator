import { Model, FindOptions, ModelStatic, WhereOptions } from "sequelize";
import {
  FilterConfig,
  HistoricStats,
  HistoricStatsId,
  Stats,
} from "@the-devoyage/request-filter-language";

export async function findAndPaginate<
  ModelType extends Record<string, unknown>
>(
  model: ModelStatic<Model<ModelType>>,
  findOptions: FindOptions,
  filterConfig: FilterConfig
): Promise<{ data: Model<ModelType>[]; stats: Stats }> {
  const { rows, count } = await model.findAndCountAll(findOptions);

  const history: HistoricStats[] = [];

  if (filterConfig.history?.interval) {
    for (const countResult of (count as unknown) as Record<
      string | "count",
      number
    >[]) {
      const _id: HistoricStatsId = {};

      for (const [key, value] of Object.entries(countResult)) {
        if (key !== "count") {
          const pIndex = key.indexOf("(");
          const slicedKey = key.slice(0, pIndex);
          const formattedKey = slicedKey;

          switch (formattedKey) {
            case "DAYOFYEAR":
              _id["DAY_OF_YEAR"] = value;
              break;
            case "DAYOFMONTH":
              _id["DAY_OF_MONTH"] = value;
              break;
            case "DAYOFWEEK":
              _id["DAY_OF_WEEK"] = value;
              break;

            default:
              _id[formattedKey as keyof HistoricStatsId] = value;
          }
        }
      }

      history.push({
        _id,
        total: countResult.count,
      } as HistoricStats);
    }
  }

  const cursor = rows.length
    ? ((rows[rows.length - 1][
      (filterConfig.pagination.date_key ??
        "createdAt") as keyof Model<ModelType>
    ] as unknown) as Date)
    : null;

  if (findOptions.where) {
    if (filterConfig.pagination.date_key) {
      if (filterConfig.pagination.date_key in findOptions.where)
        delete findOptions.where[
          filterConfig.pagination.date_key as keyof WhereOptions
        ];
    } else {
      if ("createdAt" in findOptions.where)
        delete findOptions.where["createdAt"];
    }
  }

  let total = await model.count(findOptions);
  total = Array.isArray(total) ? total.reduce((a, b) => a + b.count, 0) : total;

  const remaining = Math.max(
    0,
    (Array.isArray(count) ? count.reduce((a, b) => a + b.count, 0) : count) -
    (filterConfig.pagination.limit ?? 4)
  );

  const page = Math.ceil(
    (total - remaining) / (filterConfig.pagination.limit ?? 4)
  );

  return {
    data: rows,
    stats: {
      total,
      cursor,
      page,
      remaining,
      history,
    },
  };
}
