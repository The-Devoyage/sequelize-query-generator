import { IntFieldFilter } from "@the-devoyage/request-filter-language";
import { Op, WhereOptions } from "sequelize";

export const intWhereOptions = (
  fieldFilter: IntFieldFilter,
  fieldName: string
): WhereOptions | undefined => {
  switch (fieldFilter.filterBy) {
    case "LT": {
      return {
        [fieldName]: {
          [Op.lt]: fieldFilter.int,
        },
      };
    }
    case "GT": {
      return {
        [fieldName]: {
          [Op.gt]: fieldFilter.int,
        },
      };
    }
    case "LTE": {
      return {
        [fieldName]: {
          [Op.lte]: fieldFilter.int,
        },
      };
    }
    case "GTE": {
      return {
        [fieldName]: {
          [Op.gte]: fieldFilter.int,
        },
      };
    }
    case "NE": {
      return {
        [fieldName]: {
          [Op.ne]: fieldFilter.int,
        },
      };
    }

    case "EQ":
    default: {
      return {
        [fieldName]: {
          [Op.eq]: fieldFilter.int,
        },
      };
    }
  }
};
