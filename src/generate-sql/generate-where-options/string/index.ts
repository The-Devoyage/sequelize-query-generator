import { StringFieldFilter } from "@the-devoyage/request-filter-language";
import { Op, WhereOptions } from "sequelize";

export const stringWhereOptions = (
  fieldFilter: StringFieldFilter,
  fieldName: string
): WhereOptions | undefined => {
  switch (fieldFilter.filterBy) {
    case "REGEX": {
      return {
        [fieldName]: {
          [Op.like]: `%${fieldFilter.string}%`,
        },
      };
    }

    case "OBJECTID": {
      throw new Error(
        `SQL Query Generator Error: Object ID is not a valid SQL Option at location ${fieldName}.`
      );
    }
    case "MATCH":
    default: {
      return {
        [fieldName]: fieldFilter.string,
      };
    }
  }
};
