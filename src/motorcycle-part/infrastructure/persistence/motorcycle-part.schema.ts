import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserMotocycleSchema } from '../../../user-motocycle/infrastructure/persistence/user-motocycle.schema';

@Entity('motorcycle_parts')
@Index('idx_motorcycle_parts_user_motocycle_id', ['userMotocycleId'])
@Index('idx_motorcycle_parts_part_type', ['partType'])
@Index('idx_motorcycle_parts_is_active', ['isActive'])
export class MotorcyclePartSchema {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid')
  userMotocycleId: string;

  @Column('varchar', { length: 50 })
  partType: string;

  @Column('varchar', { length: 50 })
  partCategory: string;

  @Column('varchar', { length: 200 })
  name: string;

  @Column('varchar', { length: 100, nullable: true })
  manufacturer?: string;

  @Column('varchar', { length: 100, nullable: true })
  model?: string;

  @Column('timestamp')
  installationDate: Date;

  @Column('int')
  installationOdometer: number;

  @Column('int', { nullable: true })
  expectedLifespanKm?: number;

  @Column('int', { nullable: true })
  expectedLifespanMonths?: number;

  @Column('decimal', { precision: 10, scale: 8, nullable: true })
  wearRatePerKm?: number;

  @Column('int', { default: 70 })
  replacementThreshold: number;

  @Column('text', { nullable: true })
  notes?: string;

  @Column('boolean', { default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserMotocycleSchema, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_motocycle_id' })
  userMotocycle?: UserMotocycleSchema;
}
