import {
  BooleanFieldFilter,
  BooleanFieldFilterSchema,
  DateFieldFilter,
  DateFieldFilterSchema,
  FieldFilter,
  IntFieldFilter,
  IntFieldFilterSchema,
  StringArrayFieldFilter,
  StringArrayFieldFilterSchema,
  StringFieldFilter,
  StringFieldFilterSchema,
} from "@the-devoyage/request-filter-language";
import { WhereOptions } from "sequelize";
import { booleanWhereOptions } from "./boolean";
import { dateWhereOptions } from "./date";
import { intWhereOptions } from "./int";
import { stringWhereOptions } from "./string";
import { stringArrayWhereOptions } from "./string-array";

export const generateWhereOptions = (
  fieldFilter: FieldFilter,
  location: string
): WhereOptions | undefined => {
  if (StringFieldFilterSchema.safeParse(fieldFilter).success) {
    return stringWhereOptions(fieldFilter as StringFieldFilter, location);
  } else if (StringArrayFieldFilterSchema.safeParse(fieldFilter).success) {
    return stringArrayWhereOptions(
      fieldFilter as StringArrayFieldFilter,
      location
    );
  } else if (IntFieldFilterSchema.safeParse(fieldFilter).success) {
    return intWhereOptions(fieldFilter as IntFieldFilter, location);
  } else if (BooleanFieldFilterSchema.safeParse(fieldFilter).success) {
    return booleanWhereOptions(fieldFilter as BooleanFieldFilter, location);
  } else if (DateFieldFilterSchema.safeParse(fieldFilter).success) {
    return dateWhereOptions(fieldFilter as DateFieldFilter, location);
  }
  return;
};
