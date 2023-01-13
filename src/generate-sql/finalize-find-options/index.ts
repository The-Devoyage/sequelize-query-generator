import { Op, WhereOptions } from "sequelize";

export const finalizeFindOptions = (findOptions: {
  where: { [Op.and]?: WhereOptions[]; [Op.or]?: WhereOptions[] };
  order?: [string, string][];
  limit?: number;
}) => {
  if (!findOptions.where[Op.or]?.length) {
    delete findOptions.where[Op.or];
  }

  if (findOptions.where[Op.or]) {
    for (const filterGroup of findOptions.where[Op.or] ?? []) {
      if ("group" in filterGroup) {
        delete filterGroup.group;
      }
    }
  }

  if (findOptions.where[Op.and]) {
    for (const filterGroup of findOptions.where[Op.and] ?? []) {
      if ("group" in filterGroup) {
        delete filterGroup.group;
      }
    }
  }

  const orOptions = findOptions.where[Op.or]?.length
    ? { [Op.or]: findOptions.where[Op.or] }
    : undefined;
  const andOptions = findOptions.where[Op.and]?.length
    ? { [Op.and]: findOptions.where[Op.and] }
    : undefined;
  const finalOptions = [];

  if (orOptions) finalOptions.push(orOptions);

  if (andOptions) finalOptions.push(andOptions);

  if (finalOptions.length) findOptions.where[Op.and] = finalOptions;
  delete findOptions.where[Op.or];
};
