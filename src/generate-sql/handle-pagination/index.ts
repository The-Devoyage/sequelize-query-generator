import { FilterConfig } from "@the-devoyage/request-filter-language";
import { WhereOptions, Op } from "sequelize";

export const handlePagination = (
  findOptions: {
    where: { [Op.and]: WhereOptions[]; [Op.or]?: WhereOptions[] };
    order?: [string, string][];
    limit?: number;
  },
  filterConfig?: FilterConfig
) => {
  const dateKey = filterConfig?.pagination?.date_key ?? "createdAt";

  if (filterConfig?.pagination?.date_cursor) {
    if (filterConfig.pagination?.reverse) {
      findOptions.where = {
        ...findOptions.where,
        [dateKey]: {
          [Op.lt]: new Date(filterConfig.pagination?.date_cursor),
        },
      };
    } else {
      findOptions.where = {
        ...findOptions.where,
        [dateKey]: {
          [Op.gt]: new Date(filterConfig.pagination?.date_cursor),
        },
      };
    }
  }

  findOptions.order = [
    [dateKey, filterConfig?.pagination?.reverse ? "DESC" : "ASC"],
  ];

  findOptions.limit = filterConfig?.pagination?.limit
    ? filterConfig.pagination?.limit
    : 4;
};
