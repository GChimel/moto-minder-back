import {
  Entity,
  PrimaryColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('maintenance_records')
@Index('idx_user_motocycle_id', ['userMotocycleId'])
@Index('idx_performed_at', ['performedAt'])
@Index('idx_service_type', ['serviceType'])
export class MaintenanceRecordSchema {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid')
  userMotocycleId: string;

  @Column('varchar', { length: 50 })
  serviceType: string;

  @Column('timestamp')
  performedAt: Date;

  @Column('int')
  odometerAtService: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  cost?: number;

  @Column('text', { nullable: true })
  partsUsed?: string;

  @Column('text', { nullable: true })
  notes?: string;

  @Column('jsonb', { nullable: true })
  nextServiceInterval?: {
    intervalKm?: number;
    intervalMonths?: number;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
