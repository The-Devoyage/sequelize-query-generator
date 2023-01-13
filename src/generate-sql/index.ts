import {
  FieldFilter,
  FilterConfig,
  parseFieldFilters,
} from "@the-devoyage/request-filter-language";
import { FindOptions, Op, Sequelize } from "sequelize";
import { finalizeFindOptions } from "./finalize-find-options";
import { generateWhereOptions } from "./generate-where-options";
import { fieldRuleFieldFilter } from "./handle-field-rules";
import { handleHistory } from "./handle-history";
import { handlePagination } from "./handle-pagination";
import { modifyFindOptions } from "./modify-find-options";

export interface FieldRule {
  location: string;
  fieldFilter?: FieldFilter;
  action: "DISABLE" | "OVERRIDE" | "COMBINE" | "INITIAL";
}

interface GenerateSQLArgs {
  fieldFilters: Partial<Record<string, unknown>>;
  filterConfig?: FilterConfig;
  fieldRules?: FieldRule[];
}

interface GenerateConfig {
  verbose?: boolean;
}

export const GenerateSequelize = (
  args: GenerateSQLArgs,
  sequelize: Sequelize,
  generateConfig?: GenerateConfig
) => {
  const { fieldFilters, filterConfig, fieldRules = [] } = args;

  const findOptions: { where: { [Op.and]: []; [Op.or]?: [] } } = {
    where: { [Op.and]: [], [Op.or]: [] },
  };

  handlePagination(findOptions, filterConfig);

  for (const rootLocation in fieldFilters) {
    const filtersAndLocations = parseFieldFilters(
      fieldFilters[rootLocation],
      rootLocation,
      generateConfig
    );

    for (const fl of filtersAndLocations) {
      const fieldRule = fieldRules?.find(
        (rule) => rule.location === fl.location
      );

      if (fieldRule) {
        const { fieldFilter, filterLocation } = fieldRuleFieldFilter(
          fieldRule,
          filtersAndLocations
        );

        if (fieldFilter) {
          fl.fieldFilter = fieldFilter;
          fl.location = filterLocation;
        }

        const index = fieldRules?.findIndex(
          (rule) => rule.location === fieldRule.location
        );

        fieldRules.splice(index, 1);
      }

      const whereOptions = generateWhereOptions(fl.fieldFilter, rootLocation);
      modifyFindOptions(findOptions, whereOptions, fl.fieldFilter);
    }
  }

  if (fieldRules?.length) {
    for (const fieldRule of fieldRules) {
      const { fieldFilter, filterLocation } = fieldRuleFieldFilter(
        fieldRule,
        []
      );

      const whereOptions = generateWhereOptions(fieldFilter, filterLocation);

      modifyFindOptions(findOptions, whereOptions, fieldFilter);
    }
  }

  handleHistory(findOptions, sequelize, filterConfig);

  finalizeFindOptions(findOptions);

  return findOptions as FindOptions;
};
