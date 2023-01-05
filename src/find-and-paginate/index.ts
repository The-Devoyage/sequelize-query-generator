import { Model, FindOptions, ModelStatic, WhereOptions, Op } from "sequelize";
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
  filterConfig: FilterConfig,
  demographicFindOptions?: FindOptions
): Promise<{ data: Model<ModelType>[]; stats: Stats }> {
  const { rows, count } = await model.findAndCountAll(findOptions);

  const history: HistoricStats[] = [];
  let demographics;

  if (filterConfig.history?.interval) {
    for (const countResult of count as unknown as Record<
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
    ? (rows[rows.length - 1][
        (filterConfig.pagination.date_key ??
          "createdAt") as keyof Model<ModelType>
      ] as unknown as Date)
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

  if (demographicFindOptions && filterConfig.demographics?.compare_by) {
    const exclude = [];

    if (filterConfig.demographics?.exclude?.length) {
      for (const value of filterConfig.demographics.exclude) {
        exclude.push({ [Op.ne]: value });
        exclude.push({ [Op.ne]: parseInt(value) });
        exclude.push({ [Op.ne]: parseFloat(value) });
      }
    }

    const totalDemographics = await model.count({
      ...demographicFindOptions,
      where: {
        ...demographicFindOptions.where,
        [filterConfig.demographics.compare_by]: {
          [Op.and]: exclude,
        },
      } as WhereOptions,
    });

    const withAttributes = {
      ...demographicFindOptions,
      group: [filterConfig.demographics.compare_by],
    };

    const groupedDemographics = (await model.count(
      withAttributes as unknown as FindOptions
    )) as unknown as Record<string, number>[];

    for (const group of groupedDemographics) {
      group.average = group.count / totalDemographics;
    }

    const comparedAverage = parseFloat(
      (
        (groupedDemographics.reduce((a, b) => a + b.average, 0) /
          groupedDemographics.length) *
        100
      ).toFixed(2)
    );

    demographics = {
      query: {
        total,
        average: parseFloat(((total / totalDemographics) * 100).toFixed(2)),
      },
      compared: {
        total: totalDemographics,
        average: comparedAverage,
      },
    };
  }

  return {
    data: rows,
    stats: {
      total,
      cursor,
      page,
      remaining,
      history,
      demographics,
    },
  };
}
