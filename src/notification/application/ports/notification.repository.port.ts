import { Notification } from '../../domain/entities/notification.entity';

export interface NotificationRepositoryPort {
  save(notification: Notification): Promise<Notification>;
  findById(id: string): Promise<Notification | null>;
  findByUserId(userId: string): Promise<Notification[]>;
  findPending(): Promise<Notification[]>;
  delete(id: string): Promise<void>;
}

export const NOTIFICATION_REPOSITORY = 'NOTIFICATION_REPOSITORY';
