import { Kysely } from 'kysely';

import { MetricTypeEnum } from '~/modules/metric/domain/metric-type';

export interface UserTable {
  id: string;
  // email: ColumnType<string, never, never>;
  email: string;
  hashedPassword: string;
  token: string | null;
}

export interface ProjectTable {
  id: string;
  name: string;
  default_branch: string;
}

export interface MetricTable {
  id: string;
  label: string;
  type: MetricTypeEnum;
  project_id: string;
}

export interface SnapshotTable {
  id: string;
  date: string;
  project_id: string;
}

export interface MetricValueTable {
  id: string;
  snapshot_id: string;
  metric_id: string;
  value: number;
}

export interface DatabaseDefinition {
  user: UserTable;
  project: ProjectTable;
  metric: MetricTable;
  snapshot: SnapshotTable;
  metric_value: MetricValueTable;
}

export type Database = Kysely<DatabaseDefinition>;
export type TableName = keyof DatabaseDefinition;
