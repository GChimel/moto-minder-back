import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMaintenanceRecordsTable1765200000000
  implements MigrationInterface
{
  name = 'CreateMaintenanceRecordsTable1765200000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "maintenance_records" ("id" uuid NOT NULL, "userMotocycleId" uuid NOT NULL, "serviceType" character varying(50) NOT NULL, "performedAt" TIMESTAMP NOT NULL, "odometerAtService" integer NOT NULL, "cost" numeric(10,2), "partsUsed" text, "notes" text, "nextServiceInterval" jsonb, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_maintenance_records_id" PRIMARY KEY ("id"))`,
    );

    await queryRunner.query(
      `CREATE INDEX "idx_user_motocycle_id" ON "maintenance_records" ("userMotocycleId")`,
    );

    await queryRunner.query(
      `CREATE INDEX "idx_performed_at" ON "maintenance_records" ("performedAt")`,
    );

    await queryRunner.query(
      `CREATE INDEX "idx_service_type" ON "maintenance_records" ("serviceType")`,
    );

    await queryRunner.query(
      `ALTER TABLE "maintenance_records" ADD CONSTRAINT "FK_maintenance_records_user_motocycle_id" FOREIGN KEY ("userMotocycleId") REFERENCES "user_motocycles"("id") ON DELETE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "maintenance_records" DROP CONSTRAINT "FK_maintenance_records_user_motocycle_id"`,
    );

    await queryRunner.query(`DROP INDEX "idx_service_type"`);

    await queryRunner.query(`DROP INDEX "idx_performed_at"`);

    await queryRunner.query(`DROP INDEX "idx_user_motocycle_id"`);

    await queryRunner.query(`DROP TABLE "maintenance_records"`);
  }
}
