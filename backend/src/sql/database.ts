import { ColumnType, Generated, Kysely, SqliteDialect } from 'kysely';

export interface UserTable {
  id: Generated<string>;
  email: ColumnType<string, never, never>;
  hashedPassword: string;
  token: string | null;
}

export interface Database {
  user: UserTable;
}

export default new Kysely<Database>({
  dialect: new SqliteDialect({
    databasePath: 'db.sqlite',
  }),
});
