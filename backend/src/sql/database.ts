import { ColumnType, Kysely, SqliteDialect } from 'kysely';

export interface UserTable {
  id: string;
  email: ColumnType<string, never, never>;
  hashedPassword: string;
  token: string | null;
}

export interface ProjectTable {
  id: string;
  name: string;
  default_branch: string;
}

export interface Database {
  user: UserTable;
  project: ProjectTable;
}

export default new Kysely<Database>({
  dialect: new SqliteDialect({
    databasePath: 'db.sqlite',
  }),
});
