export const partition = <K extends PropertyKey, T extends { [key in K]: PropertyKey | null }>(
  key: K,
  rows: T[],
): Record<PropertyKey, T[]> => {
  return rows.reduce(
    (obj, row) => ({
      ...obj,
      [String(row[key])]: [...(obj[String(row[key])] ?? []), row],
    }),
    {} as Record<PropertyKey, T[]>,
  );
};
