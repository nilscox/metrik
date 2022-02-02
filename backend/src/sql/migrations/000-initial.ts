import { Kysely } from 'kysely';

import { MetricTypeEnum } from '~/modules/metric/domain/metric-type';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('user')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('email', 'text', (col) => col.notNull())
    .addColumn('hashedPassword', 'text', (col) => col.notNull())
    .addColumn('token', 'text')
    .execute();

  await db.schema
    .createTable('project')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('default_branch', 'text', (col) => col.notNull())
    .execute();

  const metricTypes = Object.values(MetricTypeEnum)
    .map((value) => `'${value}'`)
    .join(',');

  await db.schema
    .createTable('metric')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('label', 'text', (col) => col.notNull())
    .addColumn('type', 'text', (col) => col.check(db.raw(`type IN (${metricTypes})`)).notNull())
    .addColumn('project_id', 'text', (col) =>
      col.references('project.id').onDelete('cascade').notNull(),
    )
    .execute();

  await db.schema
    .createTable('snapshot')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('date', 'date', (col) => col.notNull())
    .addColumn('project_id', 'text', (col) =>
      col.references('project.id').onDelete('cascade').notNull(),
    )
    .execute();

  await db.schema
    .createTable('metric_value')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('value', 'double precision', (col) => col.notNull())
    .addColumn('snapshot_id', 'text', (col) =>
      col.references('snapshot.id').onDelete('cascade').notNull(),
    )
    .addColumn('metric_id', 'text', (col) =>
      col.references('metric.id').onDelete('cascade').notNull(),
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('metric').execute();
  await db.schema.dropTable('project').execute();
  await db.schema.dropTable('user').execute();
}
