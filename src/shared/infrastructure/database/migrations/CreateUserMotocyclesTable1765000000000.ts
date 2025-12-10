import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserMotocyclesTable1765000000000
  implements MigrationInterface
{
  name = 'CreateUserMotocyclesTable1765000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_motocycles" ("id" uuid NOT NULL, "userId" uuid NOT NULL, "motocycleModelId" uuid NOT NULL, "nickname" character varying(100) NOT NULL, "manufacturingYear" integer NOT NULL, "currentOdometer" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "specificationsOverride" jsonb, CONSTRAINT "PK_user_motocycles_id" PRIMARY KEY ("id"))`,
    );

    await queryRunner.query(
      `CREATE INDEX "idx_user_motocycles_user_id" ON "user_motocycles" ("userId")`,
    );

    await queryRunner.query(
      `CREATE INDEX "idx_user_motocycles_motorcycle_model_id" ON "user_motocycles" ("motocycleModelId")`,
    );

    await queryRunner.query(
      `ALTER TABLE "user_motocycles" ADD CONSTRAINT "FK_user_motocycles_user_id" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE`,
    );

    await queryRunner.query(
      `ALTER TABLE "user_motocycles" ADD CONSTRAINT "FK_user_motocycles_motorcycle_model_id" FOREIGN KEY ("motocycleModelId") REFERENCES "motocycle_models"("id") ON DELETE RESTRICT`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_motocycles" DROP CONSTRAINT "FK_user_motocycles_motorcycle_model_id"`,
    );

    await queryRunner.query(
      `ALTER TABLE "user_motocycles" DROP CONSTRAINT "FK_user_motocycles_user_id"`,
    );

    await queryRunner.query(
      `DROP INDEX "idx_user_motocycles_motorcycle_model_id"`,
    );

    await queryRunner.query(`DROP INDEX "idx_user_motocycles_user_id"`);

    await queryRunner.query(`DROP TABLE "user_motocycles"`);
  }
}
