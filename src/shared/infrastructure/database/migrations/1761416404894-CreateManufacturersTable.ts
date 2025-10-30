import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateManufacturersTable1761416404894
  implements MigrationInterface
{
  name = 'CreateManufacturersTable1761416404894';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "manufacturers" ("id" uuid NOT NULL, "name" character varying(100) NOT NULL, CONSTRAINT "PK_138520de32c379a48e703441975" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "manufacturers"`);
  }
}
