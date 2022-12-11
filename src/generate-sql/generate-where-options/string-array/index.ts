import { StringArrayFieldFilter } from "@the-devoyage/request-filter-language";
import { Op, WhereOptions } from "sequelize";

export const stringArrayWhereOptions = (
  fieldFilter: StringArrayFieldFilter,
  fieldName: string
): WhereOptions | undefined => {
  switch (fieldFilter.filterBy) {
    case "MATCH": {
      return {
        [fieldName]: {
          [Op.in]: fieldFilter.strings,
        },
      };
    }

    case "REGEX": {
      return {
        [fieldName]: {
          [Op.like]: fieldFilter.strings.map((string) => `%${string}%`),
        },
      };
    }

    case "OBJECTID": {
      throw new Error(
        `SQL Query Generator Error: Object ID is not a valid SQL Option at location ${fieldName}.`
      );
    }

    default:
      return undefined;
  }
};
