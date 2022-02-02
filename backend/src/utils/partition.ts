export const partition = <T>(key: keyof T, rows: T[]): Record<PropertyKey, T[]> => {
  return rows.reduce(
    (obj, row) => ({
      ...obj,
      [String(row[key])]: [...(obj[String(row[key])] ?? []), row],
    }),
    {} as Record<PropertyKey, T[]>,
  );
};
