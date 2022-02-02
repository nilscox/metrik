import { Compilable } from 'kysely';

export function logSqlQuery<T extends Compilable>(qb: T): T {
  console.log(qb.compile());
  return qb;
}
