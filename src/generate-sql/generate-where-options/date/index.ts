import { DateFieldFilter } from "@the-devoyage/request-filter-language";
import { Op, WhereOptions } from "sequelize";

export const dateWhereOptions = (
  fieldFilter: DateFieldFilter,
  fieldName: string
): WhereOptions | undefined => {
  const date = new Date(fieldFilter.date);

  switch (fieldFilter.filterBy) {
    case "LTE": {
      return {
        [fieldName]: {
          [Op.lte]: date,
        },
      };
    }
    case "GTE": {
      return {
        [fieldName]: {
          [Op.gte]: date,
        },
      };
    }
    case "NE": {
      return {
        [fieldName]: {
          [Op.ne]: date,
        },
      };
    }
    case "GT": {
      return {
        [fieldName]: {
          [Op.gt]: date,
        },
      };
    }
    case "LT": {
      return {
        [fieldName]: {
          [Op.lt]: date,
        },
      };
    }

    case "EQ":
    default: {
      return {
        [fieldName]: {
          [Op.eq]: date,
        },
      };
    }
  }
};
