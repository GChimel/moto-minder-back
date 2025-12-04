import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMotocycleModelTable1764838577766
  implements MigrationInterface
{
  name = 'CreateMotocycleModelTable1764838577766';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "motocycle_models" ("id" uuid NOT NULL, "manufacturer_id" uuid NOT NULL, "name" character varying(100) NOT NULL, "year_start" integer NOT NULL, "year_end" integer NOT NULL, "displacement_cc" integer NOT NULL, "engine_type" character varying(100) NOT NULL, "engine_cycle" character varying(100) NOT NULL, "valves_per_cylinder" integer NOT NULL, "cooling_system" character varying(20) NOT NULL, "fuel_system" character varying(30) NOT NULL, "spark_plug_default" character varying(50) NOT NULL, "baterry_default" character varying(50) NOT NULL, "final_drive" character varying(20) NOT NULL, "gears" integer NOT NULL, "clutch_type" character varying(50) NOT NULL, "engine_oil_capacity_l" numeric(4,2) NOT NULL, "recommended_oil_viscosity" character varying(20) NOT NULL, "recommended_oil_spec" character varying(50) NOT NULL, "coolant_capacity_l" numeric(4,2) NOT NULL, "fuel_tank_capacity_l" numeric(4,2) NOT NULL, CONSTRAINT "PK_aa6bfa45fa0169a5aa92a7014c1" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "motocycle_models"`);
  }
}
