import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateNotificationsTable1735312800000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'notifications',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'userId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'notificationType',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'subject',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'htmlContent',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'relatedEntityId',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
          {
            name: 'sentAt',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'failureReason',
            type: 'text',
            isNullable: true,
          },
        ],
        foreignKeys: [
          {
            columnNames: ['userId'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
    );

    await queryRunner.createIndex(
      'notifications',
      new TableIndex({
        name: 'idx_notification_user_id',
        columnNames: ['userId'],
      }),
    );

    await queryRunner.createIndex(
      'notifications',
      new TableIndex({
        name: 'idx_notification_status',
        columnNames: ['status'],
      }),
    );

    await queryRunner.createIndex(
      'notifications',
      new TableIndex({
        name: 'idx_notification_created_at',
        columnNames: ['createdAt'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('notifications');
  }
}
