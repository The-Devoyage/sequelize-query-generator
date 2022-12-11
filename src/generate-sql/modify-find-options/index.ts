import { FieldFilter } from "@the-devoyage/request-filter-language";
import { FindOptions, Op, WhereOptions } from "sequelize";
import { SQGError } from "../../utils/build-error";

export const modifyFindOptions = (
  findOptions: {
    where: { [Op.and]: WhereOptions[]; [Op.or]?: WhereOptions[] };
  },
  whereOptions: WhereOptions | undefined,
  fieldFilter: FieldFilter
): FindOptions => {
  if (whereOptions) {
    if (fieldFilter.groups?.length) {
      for (const group of fieldFilter.groups) {
        const rootOperator = fieldFilter.operator
          ? fieldFilter.operator === "OR"
            ? Op.or
            : Op.and
          : Op.and;
        const groupOperator = group.includes(".or")
          ? Op.or
          : group.includes(".and")
          ? Op.and
          : null;

        if (!groupOperator) {
          throw new SQGError(
            "Group names must have the suffix of `.and` or `.or`. Example: `namesOrEmails.or`"
          );
        }

        if (findOptions.where[rootOperator]) {
          const groupToUpdate = findOptions.where[rootOperator]?.find(
            (existing) =>
              (
                existing as {
                  group?: string;
                }
              ).group === group
          );

          if (groupToUpdate) {
            (groupToUpdate[
              groupOperator as keyof WhereOptions
            ] as WhereOptions[]) = [
              ...(groupToUpdate[groupOperator as keyof WhereOptions] ?? []),
              whereOptions,
            ];
          } else {
            findOptions.where[rootOperator] = [
              ...(findOptions.where[rootOperator] ?? []),
              {
                [groupOperator]: [whereOptions],
                group,
              },
            ];
          }
        } else {
          findOptions.where[rootOperator] = [
            {
              [groupOperator]: [whereOptions],
              group,
            },
          ];
        }
      }
    } else {
      if (fieldFilter.operator === "OR") {
        if (!findOptions.where[Op.or]) {
          findOptions = {
            ...findOptions,
            where: { ...findOptions.where, [Op.or]: [] },
          };
        }
        const currentOrOptions = findOptions.where[Op.or] ?? [];

        findOptions.where[Op.or] = [...currentOrOptions, whereOptions];
      } else {
        findOptions.where[Op.and] = [
          ...findOptions.where[Op.and],
          whereOptions,
        ];
      }
    }
  }

  return findOptions as FindOptions;
};
