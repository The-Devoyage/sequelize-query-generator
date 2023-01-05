import {
  FieldFilter,
  FilterConfig,
} from "@the-devoyage/request-filter-language";
import { Op, Sequelize } from "sequelize";
import { finalizeFindOptions } from "./finalize-find-options";
import { generateWhereOptions } from "./generate-where-options";
import { fieldRuleFieldFilter } from "./handle-field-rules";
import { handleHistory } from "./handle-history";
import { handlePagination } from "./handle-pagination";
import { modifyFindOptions } from "./modify-find-options";
import { GenerateConfig, handleFindOptions } from "./handle-find-options";

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

export const GenerateSQL = (
  args: GenerateSQLArgs,
  sequelize: Sequelize,
  generateConfig?: GenerateConfig
) => {
  const { fieldFilters, filterConfig, fieldRules = [] } = args;

  let findOptions: { where: { [Op.and]: []; [Op.or]?: [] } } = {
    where: { [Op.and]: [], [Op.or]: [] },
  };
  let demographicFindOptions: { where: { [Op.and]: []; [Op.or]?: [] } } = {
    where: { [Op.and]: [], [Op.or]: [] },
  };

  handlePagination(findOptions, filterConfig);

  findOptions = handleFindOptions(
    findOptions,
    fieldFilters,
    fieldRules,
    null,
    generateConfig
  );

  if (filterConfig?.demographics?.compare_by) {
    demographicFindOptions = handleFindOptions(
      demographicFindOptions,
      fieldFilters,
      fieldRules,
      filterConfig,
      generateConfig
    );
  }

  if (fieldRules?.length) {
    for (const fieldRule of fieldRules) {
      const { fieldFilter, filterLocation } = fieldRuleFieldFilter(
        fieldRule,
        []
      );

      const whereOptions = generateWhereOptions(fieldFilter, filterLocation);

      modifyFindOptions(findOptions, whereOptions, fieldFilter);
      modifyFindOptions(demographicFindOptions, whereOptions, fieldFilter);
    }
  }

  handleHistory(findOptions, sequelize, filterConfig);

  finalizeFindOptions(findOptions);
  finalizeFindOptions(demographicFindOptions);

  return { findOptions, demographicFindOptions };
};
