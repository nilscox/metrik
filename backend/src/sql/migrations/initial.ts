import { Kysely } from 'kysely';

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
    .addColumn('metrics_config', 'text', (col) => col.notNull())
    .execute();

  await db.schema
    .createTable('snapshot')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('date', 'text', (col) => col.notNull())
    .addColumn('project_id', 'text', (col) =>
      col.references('project.id').onDelete('cascade').notNull(),
    )
    .execute();

  await db.schema
    .createTable('metric')
    .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
    .addColumn('label', 'text', (col) => col.notNull())
    .addColumn('value', 'numeric')
    .addColumn('snapshot_id', 'text', (col) =>
      col.references('snapshot.id').onDelete('cascade').notNull(),
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('metric').execute();
  await db.schema.dropTable('project').execute();
  await db.schema.dropTable('user').execute();
}
