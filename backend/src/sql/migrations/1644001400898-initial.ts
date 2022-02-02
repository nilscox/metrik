import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1644001400898 implements MigrationInterface {
    name = 'initial1644001400898'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "project" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "default_branch" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "metric" ("id" varchar PRIMARY KEY NOT NULL, "label" varchar NOT NULL, "projectId" varchar NOT NULL, "type" text NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "snapshot" ("id" varchar PRIMARY KEY NOT NULL, "date" varchar NOT NULL, "projectId" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "metric_value" ("id" varchar PRIMARY KEY NOT NULL, "metricId" varchar NOT NULL, "value" integer NOT NULL, "snapshotId" varchar)`);
        await queryRunner.query(`CREATE TABLE "user" ("id" varchar PRIMARY KEY NOT NULL, "email" varchar NOT NULL, "hashedPassword" varchar NOT NULL, "token" text)`);
        await queryRunner.query(`CREATE TABLE "temporary_metric" ("id" varchar PRIMARY KEY NOT NULL, "label" varchar NOT NULL, "projectId" varchar NOT NULL, "type" text NOT NULL, CONSTRAINT "FK_e349d5c307cf8c81c38cd95b699" FOREIGN KEY ("projectId") REFERENCES "project" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_metric"("id", "label", "projectId", "type") SELECT "id", "label", "projectId", "type" FROM "metric"`);
        await queryRunner.query(`DROP TABLE "metric"`);
        await queryRunner.query(`ALTER TABLE "temporary_metric" RENAME TO "metric"`);
        await queryRunner.query(`CREATE TABLE "temporary_metric_value" ("id" varchar PRIMARY KEY NOT NULL, "metricId" varchar NOT NULL, "value" integer NOT NULL, "snapshotId" varchar, CONSTRAINT "FK_21a97109dee06f7457793f24e9f" FOREIGN KEY ("snapshotId") REFERENCES "snapshot" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_c399530b34560f9c37bd9eeb1ba" FOREIGN KEY ("metricId") REFERENCES "metric" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_metric_value"("id", "metricId", "value", "snapshotId") SELECT "id", "metricId", "value", "snapshotId" FROM "metric_value"`);
        await queryRunner.query(`DROP TABLE "metric_value"`);
        await queryRunner.query(`ALTER TABLE "temporary_metric_value" RENAME TO "metric_value"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "metric_value" RENAME TO "temporary_metric_value"`);
        await queryRunner.query(`CREATE TABLE "metric_value" ("id" varchar PRIMARY KEY NOT NULL, "metricId" varchar NOT NULL, "value" integer NOT NULL, "snapshotId" varchar)`);
        await queryRunner.query(`INSERT INTO "metric_value"("id", "metricId", "value", "snapshotId") SELECT "id", "metricId", "value", "snapshotId" FROM "temporary_metric_value"`);
        await queryRunner.query(`DROP TABLE "temporary_metric_value"`);
        await queryRunner.query(`ALTER TABLE "metric" RENAME TO "temporary_metric"`);
        await queryRunner.query(`CREATE TABLE "metric" ("id" varchar PRIMARY KEY NOT NULL, "label" varchar NOT NULL, "projectId" varchar NOT NULL, "type" text NOT NULL)`);
        await queryRunner.query(`INSERT INTO "metric"("id", "label", "projectId", "type") SELECT "id", "label", "projectId", "type" FROM "temporary_metric"`);
        await queryRunner.query(`DROP TABLE "temporary_metric"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "metric_value"`);
        await queryRunner.query(`DROP TABLE "snapshot"`);
        await queryRunner.query(`DROP TABLE "metric"`);
        await queryRunner.query(`DROP TABLE "project"`);
    }

}
