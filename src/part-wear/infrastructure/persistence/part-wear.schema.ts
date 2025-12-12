import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { MotorcyclePartSchema } from '../../../motorcycle-part/infrastructure/persistence/motorcycle-part.schema';

@Entity('part_wear')
@Index('idx_part_wear_motorcycle_part_id', ['motorcyclePartId'])
@Index('idx_part_wear_is_maintenance_due', ['isMaintenanceDue'])
export class PartWearSchema {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid')
  motorcyclePartId: string;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  currentWearPercentage: number;

  @Column('timestamp')
  lastCalculatedAt: Date;

  @Column('int')
  lastKnownOdometer: number;

  @Column('int', { default: 0 })
  projectedReplacementOdometer: number;

  @Column('timestamp', { nullable: true })
  projectedReplacementDate?: Date;

  @Column('boolean', { default: false })
  isMaintenanceDue: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => MotorcyclePartSchema, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'motorcyclePartId' })
  motorcyclePart: MotorcyclePartSchema;
}
