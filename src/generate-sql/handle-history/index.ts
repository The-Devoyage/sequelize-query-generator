import { FilterConfig } from "@the-devoyage/request-filter-language";
import { FindOptions } from "sequelize";

export const handleHistory = (
  findOptions: FindOptions,
  sequelize: any,
  filterConfig?: FilterConfig
) => {
  if (filterConfig?.history?.interval && filterConfig?.history?.interval_key) {
    findOptions.group = filterConfig.history.interval.map((i) =>
      sequelize.fn(
        i.replace("_", ""),
        sequelize.col(filterConfig.history.interval_key)
      )
    );
  }
};
