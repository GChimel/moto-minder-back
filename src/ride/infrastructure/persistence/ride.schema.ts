import {
  Entity,
  PrimaryColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('rides')
@Index('idx_rides_user_motocycle_id', ['userMotocycleId'])
@Index('idx_rides_start_date', ['startDate'])
@Index('idx_rides_status', ['status'])
export class RideSchema {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid')
  userMotocycleId: string;

  @Column('timestamp')
  startDate: Date;

  @Column('timestamp', { nullable: true })
  endDate?: Date;

  @Column('int')
  startOdometer: number;

  @Column('int', { nullable: true })
  endOdometer?: number;

  @Column('decimal', { precision: 6, scale: 2, nullable: true })
  fuelConsumed?: number;

  @Column('varchar', { length: 20 })
  status: string;

  @Column('text', { nullable: true })
  notes?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
