import { ColumnType, Kysely } from 'kysely';

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

export interface DatabaseDefinition {
  user: UserTable;
  project: ProjectTable;
}

export type Database = Kysely<DatabaseDefinition>;
