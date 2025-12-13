import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('notifications')
@Index('idx_notification_user_id', ['userId'])
@Index('idx_notification_status', ['status'])
@Index('idx_notification_created_at', ['createdAt'])
export class NotificationSchema {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column('varchar', { length: 255 })
  email: string;

  @Column('varchar', { length: 50 })
  notificationType: string;

  @Column('varchar', { length: 255 })
  subject: string;

  @Column('text')
  htmlContent: string;

  @Column('varchar', { length: 50 })
  status: string;

  @Column('uuid', { nullable: true })
  relatedEntityId?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('timestamp', { nullable: true })
  sentAt?: Date;

  @Column('text', { nullable: true })
  failureReason?: string;
}
