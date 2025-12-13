import { Notification } from '../../domain/entities/notification.entity';

export class NotificationResponseDto {
  id: string;
  userId: string;
  email: string;
  notificationType: string;
  subject: string;
  status: string;
  createdAt: Date;
  sentAt?: Date;
  failureReason?: string;

  constructor(notification: Notification) {
    this.id = notification.getId();
    this.userId = notification.getUserId();
    this.email = notification.getEmail();
    this.notificationType = notification.getNotificationType();
    this.subject = notification.getSubject();
    this.status = notification.getStatus();
    this.createdAt = notification.getCreatedAt();
    this.sentAt = notification.getSentAt();
    this.failureReason = notification.getFailureReason();
  }

  static mapMultiple(notifications: Notification[]): NotificationResponseDto[] {
    return notifications.map(
      (notification) => new NotificationResponseDto(notification),
    );
  }
}
