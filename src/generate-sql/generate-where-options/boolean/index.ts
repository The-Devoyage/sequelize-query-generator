import { BooleanFieldFilter } from "@the-devoyage/request-filter-language";
import { Op, WhereOptions } from "sequelize";

export const booleanWhereOptions = (
  fieldFilter: BooleanFieldFilter,
  fieldName: string
): WhereOptions | undefined => {
  switch (fieldFilter.filterBy) {
    case "NE": {
      return {
        [Op.or]: [
          { [fieldName]: fieldFilter.bool ? 0 : 1 },
          { [fieldName]: fieldFilter.bool ? false : true },
        ],
      };
    }
    case "EQ":
    default: {
      return {
        [Op.or]: [
          { [fieldName]: fieldFilter.bool ? 1 : 0 },
          { [fieldName]: fieldFilter.bool ? true : false },
        ],
      };
    }
  }
};
