import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreatePartWearTable1733918400000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'part_wear',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'motorcyclePartId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'currentWearPercentage',
            type: 'numeric',
            precision: 5,
            scale: 2,
            default: 0,
          },
          {
            name: 'lastCalculatedAt',
            type: 'timestamp',
            isNullable: false,
          },
          {
            name: 'lastKnownOdometer',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'projectedReplacementOdometer',
            type: 'int',
            default: 0,
          },
          {
            name: 'projectedReplacementDate',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'isMaintenanceDue',
            type: 'boolean',
            default: false,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'part_wear',
      new TableForeignKey({
        columnNames: ['motorcyclePartId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'motorcycle_parts',
        onDelete: 'CASCADE',
        name: 'FK_part_wear_motorcycle_part_id',
      }),
    );

    await queryRunner.createIndex(
      'part_wear',
      new TableIndex({
        columnNames: ['motorcyclePartId'],
        name: 'idx_part_wear_motorcycle_part_id',
      }),
    );

    await queryRunner.createIndex(
      'part_wear',
      new TableIndex({
        columnNames: ['isMaintenanceDue'],
        name: 'idx_part_wear_is_maintenance_due',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('part_wear');
    const foreignKey = table?.foreignKeys.find(
      (fk) => fk.name === 'FK_part_wear_motorcycle_part_id',
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('part_wear', foreignKey);
    }

    await queryRunner.dropTable('part_wear');
  }
}
