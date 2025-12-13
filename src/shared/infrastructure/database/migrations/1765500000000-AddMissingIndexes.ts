import { MigrationInterface, QueryRunner, TableIndex } from 'typeorm';

export class AddMissingIndexes1765500000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add createdAt index to users table
    await queryRunner.createIndex(
      'users',
      new TableIndex({
        name: 'idx_users_created_at',
        columnNames: ['createdAt'],
      }),
    );

    // Add email index to users table (for login lookups)
    await queryRunner.createIndex(
      'users',
      new TableIndex({
        name: 'idx_users_email',
        columnNames: ['email'],
      }),
    );

    // Add createdAt index to rides table
    await queryRunner.createIndex(
      'rides',
      new TableIndex({
        name: 'idx_rides_created_at',
        columnNames: ['createdAt'],
      }),
    );

    // Add createdAt index to part_wear table
    await queryRunner.createIndex(
      'part_wear',
      new TableIndex({
        name: 'idx_part_wear_created_at',
        columnNames: ['createdAt'],
      }),
    );

    // Add createdAt index to maintenance_records table
    await queryRunner.createIndex(
      'maintenance_records',
      new TableIndex({
        name: 'idx_maintenance_records_created_at',
        columnNames: ['createdAt'],
      }),
    );

    // Add createdAt index to user_motocycles table
    await queryRunner.createIndex(
      'user_motocycles',
      new TableIndex({
        name: 'idx_user_motocycles_created_at',
        columnNames: ['createdAt'],
      }),
    );

    // Add composite index (userId, createdAt) to user_motocycles table
    await queryRunner.createIndex(
      'user_motocycles',
      new TableIndex({
        name: 'idx_user_motocycles_user_id_created_at',
        columnNames: ['userId', 'createdAt'],
      }),
    );

    // Add createdAt index to motorcycle_parts table
    await queryRunner.createIndex(
      'motorcycle_parts',
      new TableIndex({
        name: 'idx_motorcycle_parts_created_at',
        columnNames: ['createdAt'],
      }),
    );

    // Add composite index (userMotocycleId, isActive) to motorcycle_parts table
    await queryRunner.createIndex(
      'motorcycle_parts',
      new TableIndex({
        name: 'idx_motorcycle_parts_motorcycle_id_active',
        columnNames: ['userMotocycleId', 'isActive'],
      }),
    );

    // Add index on motocycle_models manufacturer_id
    await queryRunner.createIndex(
      'motocycle_models',
      new TableIndex({
        name: 'idx_motocycle_models_manufacturer_id',
        columnNames: ['manufacturerId'],
      }),
    );

    // Add index on motocycle_models name for searches
    await queryRunner.createIndex(
      'motocycle_models',
      new TableIndex({
        name: 'idx_motocycle_models_name',
        columnNames: ['name'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop all indexes in reverse order
    await queryRunner.dropIndex(
      'motocycle_models',
      'idx_motocycle_models_name',
    );
    await queryRunner.dropIndex(
      'motocycle_models',
      'idx_motocycle_models_manufacturer_id',
    );
    await queryRunner.dropIndex(
      'motorcycle_parts',
      'idx_motorcycle_parts_motorcycle_id_active',
    );
    await queryRunner.dropIndex(
      'motorcycle_parts',
      'idx_motorcycle_parts_created_at',
    );
    await queryRunner.dropIndex(
      'user_motocycles',
      'idx_user_motocycles_user_id_created_at',
    );
    await queryRunner.dropIndex(
      'user_motocycles',
      'idx_user_motocycles_created_at',
    );
    await queryRunner.dropIndex(
      'maintenance_records',
      'idx_maintenance_records_created_at',
    );
    await queryRunner.dropIndex('part_wear', 'idx_part_wear_created_at');
    await queryRunner.dropIndex('rides', 'idx_rides_created_at');
    await queryRunner.dropIndex('users', 'idx_users_email');
    await queryRunner.dropIndex('users', 'idx_users_created_at');
  }
}
