import { FieldFilter } from "@the-devoyage/request-filter-language";
import { SQGError } from "../../utils/build-error";
import { FieldRule } from "../";

export const fieldRuleFieldFilter = (
  fieldRule: FieldRule,
  currentFilters: { fieldFilter: FieldFilter; location: string }[]
): { fieldFilter: FieldFilter; filterLocation: string } => {
  const currentFilter = currentFilters.find(
    (f) => f.location === fieldRule.location
  );

  if (!currentFilter) {
    throw new SQGError(
      `Access to property "${fieldRule.location}" denied. Override value has been defined by server.`
    );
  }

  switch (fieldRule.action) {
    case "DISABLE":
      if (currentFilter) {
        throw new SQGError(
          `Access to property "${fieldRule.location}" denied by server.`
        );
      }
      break;

    case "COMBINE":
      if (!fieldRule.fieldFilter?.groups?.length) {
        throw new SQGError(
          `Use of field rule action "COMBINE" requires at least one group to be present.`
        );
      }

      if (currentFilter) {
        return {
          fieldFilter: {
            ...currentFilter.fieldFilter,
            groups: [
              ...(currentFilter.fieldFilter.groups ?? []),
              ...(fieldRule.fieldFilter?.groups ?? []),
            ],
          },
          filterLocation: fieldRule.location,
        };
      }
      break;

    case "INITIAL":
      if (currentFilter) {
        return {
          fieldFilter: currentFilter.fieldFilter,
          filterLocation: fieldRule.location,
        };
      }
      break;

    case "OVERRIDE":
    default:
      if (currentFilter) {
        throw new SQGError(
          `Access to property "${fieldRule.location}" denied. Override value has been defined by server.`
        );
      }

      if (!fieldRule.fieldFilter) {
        throw new SQGError(
          `Access to property "${fieldRule.location}" denied. Override value has not been specified by server.`
        );
      }

      return {
        fieldFilter: fieldRule.fieldFilter,
        filterLocation: fieldRule.location,
      };
  }

  return currentFilter;
};
