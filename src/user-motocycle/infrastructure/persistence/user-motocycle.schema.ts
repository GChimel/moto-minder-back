import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('user_motocycles')
@Index('idx_user_motocycles_user_id', ['userId'])
@Index('idx_user_motocycles_motorcycle_model_id', ['motocycleModelId'])
export class UserMotocycleSchema {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column('uuid')
  motocycleModelId: string;

  @Column('varchar', { length: 100 })
  nickname: string;

  @Column('int')
  manufacturingYear: number;

  @Column('int')
  currentOdometer: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('jsonb', { nullable: true })
  specificationsOverride?: object | null;
}
