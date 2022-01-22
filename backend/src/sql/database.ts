import { ColumnType, Generated, Kysely } from 'kysely';

export interface UserTable {
  id: string;
  email: ColumnType<string, never, never>;
  hashedPassword: string;
  token: string | null;
}

export interface MetricTable {
  id: Generated<string>;
  label: string;
  value: number;
  snapshot_id: string;
}

export interface MetricsSnapshotTable {
  id: string;
  date: string;
  project_id: string;
}

export interface ProjectTable {
  id: string;
  name: string;
  default_branch: string;
  metrics_config: string;
}

export interface DatabaseDefinition {
  user: UserTable;
  project: ProjectTable;
  snapshot: MetricsSnapshotTable;
  metric: MetricTable;
}

export type Database = Kysely<DatabaseDefinition>;
