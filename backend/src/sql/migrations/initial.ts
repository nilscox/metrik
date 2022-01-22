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
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('project').execute();
  await db.schema.dropTable('user').execute();
}
