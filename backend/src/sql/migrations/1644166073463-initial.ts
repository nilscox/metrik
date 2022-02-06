import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1644166073463 implements MigrationInterface {
    name = 'initial1644166073463'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "metric" ("id" varchar PRIMARY KEY NOT NULL, "label" varchar NOT NULL, "project_id" varchar NOT NULL, "type" text NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "project" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "default_branch_id" varchar, CONSTRAINT "REL_b4290ea53322b0a5b488097196" UNIQUE ("default_branch_id"))`);
        await queryRunner.query(`CREATE TABLE "branch" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "project_id" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "snapshot" ("id" varchar PRIMARY KEY NOT NULL, "ref" varchar NOT NULL, "date" varchar NOT NULL, "branch_id" varchar)`);
        await queryRunner.query(`CREATE TABLE "metric_value" ("id" varchar PRIMARY KEY NOT NULL, "metric_id" varchar NOT NULL, "value" integer NOT NULL, "snapshot_id" varchar, CONSTRAINT "UQ_1da33dca8ce2f3dbea01d22c5f1" UNIQUE ("snapshot_id", "metric_id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" varchar PRIMARY KEY NOT NULL, "email" varchar NOT NULL, "hashed_password" varchar NOT NULL, "token" text)`);
        await queryRunner.query(`CREATE TABLE "temporary_metric" ("id" varchar PRIMARY KEY NOT NULL, "label" varchar NOT NULL, "project_id" varchar NOT NULL, "type" text NOT NULL, CONSTRAINT "FK_974ee748aa3e58e602201951b8a" FOREIGN KEY ("project_id") REFERENCES "project" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_metric"("id", "label", "project_id", "type") SELECT "id", "label", "project_id", "type" FROM "metric"`);
        await queryRunner.query(`DROP TABLE "metric"`);
        await queryRunner.query(`ALTER TABLE "temporary_metric" RENAME TO "metric"`);
        await queryRunner.query(`CREATE TABLE "temporary_project" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "default_branch_id" varchar, CONSTRAINT "REL_b4290ea53322b0a5b488097196" UNIQUE ("default_branch_id"), CONSTRAINT "FK_b4290ea53322b0a5b488097196f" FOREIGN KEY ("default_branch_id") REFERENCES "branch" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_project"("id", "name", "default_branch_id") SELECT "id", "name", "default_branch_id" FROM "project"`);
        await queryRunner.query(`DROP TABLE "project"`);
        await queryRunner.query(`ALTER TABLE "temporary_project" RENAME TO "project"`);
        await queryRunner.query(`CREATE TABLE "temporary_branch" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "project_id" varchar NOT NULL, CONSTRAINT "FK_bd1cbb1a3f4e6698f30545ec8f5" FOREIGN KEY ("project_id") REFERENCES "project" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_branch"("id", "name", "project_id") SELECT "id", "name", "project_id" FROM "branch"`);
        await queryRunner.query(`DROP TABLE "branch"`);
        await queryRunner.query(`ALTER TABLE "temporary_branch" RENAME TO "branch"`);
        await queryRunner.query(`CREATE TABLE "temporary_snapshot" ("id" varchar PRIMARY KEY NOT NULL, "ref" varchar NOT NULL, "date" varchar NOT NULL, "branch_id" varchar, CONSTRAINT "FK_5d532148f7447bf6b3d5846cd62" FOREIGN KEY ("branch_id") REFERENCES "branch" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_snapshot"("id", "ref", "date", "branch_id") SELECT "id", "ref", "date", "branch_id" FROM "snapshot"`);
        await queryRunner.query(`DROP TABLE "snapshot"`);
        await queryRunner.query(`ALTER TABLE "temporary_snapshot" RENAME TO "snapshot"`);
        await queryRunner.query(`CREATE TABLE "temporary_metric_value" ("id" varchar PRIMARY KEY NOT NULL, "metric_id" varchar NOT NULL, "value" integer NOT NULL, "snapshot_id" varchar, CONSTRAINT "UQ_1da33dca8ce2f3dbea01d22c5f1" UNIQUE ("snapshot_id", "metric_id"), CONSTRAINT "FK_fd35ae94b2a8a21a5b24bb5c982" FOREIGN KEY ("snapshot_id") REFERENCES "snapshot" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_f998f610636d982fdacbdde309c" FOREIGN KEY ("metric_id") REFERENCES "metric" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_metric_value"("id", "metric_id", "value", "snapshot_id") SELECT "id", "metric_id", "value", "snapshot_id" FROM "metric_value"`);
        await queryRunner.query(`DROP TABLE "metric_value"`);
        await queryRunner.query(`ALTER TABLE "temporary_metric_value" RENAME TO "metric_value"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "metric_value" RENAME TO "temporary_metric_value"`);
        await queryRunner.query(`CREATE TABLE "metric_value" ("id" varchar PRIMARY KEY NOT NULL, "metric_id" varchar NOT NULL, "value" integer NOT NULL, "snapshot_id" varchar, CONSTRAINT "UQ_1da33dca8ce2f3dbea01d22c5f1" UNIQUE ("snapshot_id", "metric_id"))`);
        await queryRunner.query(`INSERT INTO "metric_value"("id", "metric_id", "value", "snapshot_id") SELECT "id", "metric_id", "value", "snapshot_id" FROM "temporary_metric_value"`);
        await queryRunner.query(`DROP TABLE "temporary_metric_value"`);
        await queryRunner.query(`ALTER TABLE "snapshot" RENAME TO "temporary_snapshot"`);
        await queryRunner.query(`CREATE TABLE "snapshot" ("id" varchar PRIMARY KEY NOT NULL, "ref" varchar NOT NULL, "date" varchar NOT NULL, "branch_id" varchar)`);
        await queryRunner.query(`INSERT INTO "snapshot"("id", "ref", "date", "branch_id") SELECT "id", "ref", "date", "branch_id" FROM "temporary_snapshot"`);
        await queryRunner.query(`DROP TABLE "temporary_snapshot"`);
        await queryRunner.query(`ALTER TABLE "branch" RENAME TO "temporary_branch"`);
        await queryRunner.query(`CREATE TABLE "branch" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "project_id" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "branch"("id", "name", "project_id") SELECT "id", "name", "project_id" FROM "temporary_branch"`);
        await queryRunner.query(`DROP TABLE "temporary_branch"`);
        await queryRunner.query(`ALTER TABLE "project" RENAME TO "temporary_project"`);
        await queryRunner.query(`CREATE TABLE "project" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "default_branch_id" varchar, CONSTRAINT "REL_b4290ea53322b0a5b488097196" UNIQUE ("default_branch_id"))`);
        await queryRunner.query(`INSERT INTO "project"("id", "name", "default_branch_id") SELECT "id", "name", "default_branch_id" FROM "temporary_project"`);
        await queryRunner.query(`DROP TABLE "temporary_project"`);
        await queryRunner.query(`ALTER TABLE "metric" RENAME TO "temporary_metric"`);
        await queryRunner.query(`CREATE TABLE "metric" ("id" varchar PRIMARY KEY NOT NULL, "label" varchar NOT NULL, "project_id" varchar NOT NULL, "type" text NOT NULL)`);
        await queryRunner.query(`INSERT INTO "metric"("id", "label", "project_id", "type") SELECT "id", "label", "project_id", "type" FROM "temporary_metric"`);
        await queryRunner.query(`DROP TABLE "temporary_metric"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "metric_value"`);
        await queryRunner.query(`DROP TABLE "snapshot"`);
        await queryRunner.query(`DROP TABLE "branch"`);
        await queryRunner.query(`DROP TABLE "project"`);
        await queryRunner.query(`DROP TABLE "metric"`);
    }

}
