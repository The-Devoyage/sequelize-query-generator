import {
  FilterConfig,
  parseFieldFilters,
} from "@the-devoyage/request-filter-language";
import { generateWhereOptions } from "../generate-where-options";
import { fieldRuleFieldFilter } from "../handle-field-rules";
import { modifyFindOptions } from "../modify-find-options";
import { Op } from "sequelize";
import { FieldRule } from "..";

export interface GenerateConfig {
  verbose?: boolean;
}

export const handleFindOptions = (
  findOptions: { where: { [Op.and]: []; [Op.or]?: [] } },
  fieldFilters: Record<string, unknown>,
  fieldRules: FieldRule[],
  filterConfig: FilterConfig | null,
  generateConfig?: GenerateConfig
) => {
  for (const rootLocation in fieldFilters) {
    const filtersAndLocations = parseFieldFilters(
      fieldFilters[rootLocation],
      rootLocation,
      generateConfig
    );

    for (const fl of filtersAndLocations) {
      if (filterConfig?.demographics?.compare_by) {
        if (fl.location === filterConfig.demographics.compare_by) {
          continue;
        }
      }

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
  return findOptions;
};
