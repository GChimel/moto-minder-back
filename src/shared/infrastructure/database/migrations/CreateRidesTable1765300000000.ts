import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRidesTable1765300000000 implements MigrationInterface {
  name = 'CreateRidesTable1765300000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "rides" ("id" uuid NOT NULL, "userMotocycleId" uuid NOT NULL, "startDate" TIMESTAMP NOT NULL, "endDate" TIMESTAMP, "startOdometer" integer NOT NULL, "endOdometer" integer, "fuelConsumed" numeric(6,2), "status" character varying(20) NOT NULL, "notes" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_rides_id" PRIMARY KEY ("id"))`,
    );

    await queryRunner.query(
      `CREATE INDEX "idx_rides_user_motocycle_id" ON "rides" ("userMotocycleId")`,
    );

    await queryRunner.query(
      `CREATE INDEX "idx_rides_start_date" ON "rides" ("startDate")`,
    );

    await queryRunner.query(
      `CREATE INDEX "idx_rides_status" ON "rides" ("status")`,
    );

    await queryRunner.query(
      `ALTER TABLE "rides" ADD CONSTRAINT "FK_rides_user_motocycle_id" FOREIGN KEY ("userMotocycleId") REFERENCES "user_motocycles"("id") ON DELETE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rides" DROP CONSTRAINT "FK_rides_user_motocycle_id"`,
    );

    await queryRunner.query(`DROP INDEX "idx_rides_status"`);

    await queryRunner.query(`DROP INDEX "idx_rides_start_date"`);

    await queryRunner.query(`DROP INDEX "idx_rides_user_motocycle_id"`);

    await queryRunner.query(`DROP TABLE "rides"`);
  }
}
