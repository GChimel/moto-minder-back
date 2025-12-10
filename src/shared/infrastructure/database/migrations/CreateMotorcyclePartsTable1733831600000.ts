import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMotorcyclePartsTable1733831600000
  implements MigrationInterface
{
  name = 'CreateMotorcyclePartsTable1733831600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "motorcycle_parts" ("id" uuid NOT NULL, "userMotocycleId" uuid NOT NULL, "partType" character varying(50) NOT NULL, "partCategory" character varying(50) NOT NULL, "name" character varying(200) NOT NULL, "manufacturer" character varying(100), "model" character varying(100), "installationDate" TIMESTAMP NOT NULL, "installationOdometer" integer NOT NULL, "expectedLifespanKm" integer, "expectedLifespanMonths" integer, "wearRatePerKm" numeric(10,8), "replacementThreshold" integer NOT NULL DEFAULT 70, "notes" text, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_motorcycle_parts_id" PRIMARY KEY ("id"))`,
    );

    await queryRunner.query(
      `CREATE INDEX "idx_motorcycle_parts_user_motocycle_id" ON "motorcycle_parts" ("userMotocycleId")`,
    );

    await queryRunner.query(
      `CREATE INDEX "idx_motorcycle_parts_part_type" ON "motorcycle_parts" ("partType")`,
    );

    await queryRunner.query(
      `CREATE INDEX "idx_motorcycle_parts_is_active" ON "motorcycle_parts" ("isActive")`,
    );

    await queryRunner.query(
      `ALTER TABLE "motorcycle_parts" ADD CONSTRAINT "FK_motorcycle_parts_user_motocycle_id" FOREIGN KEY ("userMotocycleId") REFERENCES "user_motocycles"("id") ON DELETE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "motorcycle_parts" DROP CONSTRAINT "FK_motorcycle_parts_user_motocycle_id"`,
    );

    await queryRunner.query(`DROP INDEX "idx_motorcycle_parts_is_active"`);

    await queryRunner.query(`DROP INDEX "idx_motorcycle_parts_part_type"`);

    await queryRunner.query(
      `DROP INDEX "idx_motorcycle_parts_user_motocycle_id"`,
    );

    await queryRunner.query(`DROP TABLE "motorcycle_parts"`);
  }
}
