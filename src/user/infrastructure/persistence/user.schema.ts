import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class UserSchema {
  @PrimaryColumn('uuid')
  public id: string;

  @Column({ length: 255 })
  public name: string;

  @Column({ unique: true, length: 255 })
  public email: string;

  @CreateDateColumn({ name: 'created_at' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt: Date;
}
