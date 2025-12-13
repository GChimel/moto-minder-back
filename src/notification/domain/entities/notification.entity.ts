import { IdVO } from '../../../shared/infrastructure/domain/value-objects/id-vo';
import {
  InvalidEmailException,
  InvalidNotificationStateException,
} from '../exceptions/notification.exceptions';

export enum NotificationType {
  MAINTENANCE_ALERT = 'MAINTENANCE_ALERT',
  RIDE_COMPLETED = 'RIDE_COMPLETED',
  MAINTENANCE_DUE = 'MAINTENANCE_DUE',
}

export enum NotificationStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  FAILED = 'FAILED',
}

export interface CreateNotificationDto {
  userId: string;
  email: string;
  notificationType: NotificationType;
  subject: string;
  htmlContent: string;
  relatedEntityId?: string;
}

export class Notification {
  private readonly id: IdVO;
  private readonly userId: IdVO;
  private readonly email: string;
  private readonly notificationType: NotificationType;
  private readonly subject: string;
  private readonly htmlContent: string;
  private readonly relatedEntityId?: IdVO;
  private status: NotificationStatus;
  private readonly createdAt: Date;
  private sentAt?: Date;
  private failureReason?: string;
  private updatedAt: Date;

  constructor(
    id: IdVO,
    userId: IdVO,
    email: string,
    notificationType: NotificationType,
    subject: string,
    htmlContent: string,
    status: NotificationStatus = NotificationStatus.PENDING,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
    relatedEntityId?: IdVO,
    sentAt?: Date,
    failureReason?: string,
  ) {
    this.validateEmail(email);

    this.id = id;
    this.userId = userId;
    this.email = email;
    this.notificationType = notificationType;
    this.subject = subject;
    this.htmlContent = htmlContent;
    this.relatedEntityId = relatedEntityId;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.sentAt = sentAt;
    this.failureReason = failureReason;
  }

  static create(dto: CreateNotificationDto): Notification {
    const id = new IdVO();
    const userId = new IdVO(dto.userId);
    const relatedEntityId = dto.relatedEntityId
      ? new IdVO(dto.relatedEntityId)
      : undefined;

    return new Notification(
      id,
      userId,
      dto.email,
      dto.notificationType,
      dto.subject,
      dto.htmlContent,
      NotificationStatus.PENDING,
      new Date(),
      new Date(),
      relatedEntityId,
    );
  }

  static reconstitute(
    id: string,
    userId: string,
    email: string,
    notificationType: NotificationType,
    subject: string,
    htmlContent: string,
    status: NotificationStatus,
    createdAt: Date,
    updatedAt: Date,
    relatedEntityId?: string,
    sentAt?: Date,
    failureReason?: string,
  ): Notification {
    return new Notification(
      new IdVO(id),
      new IdVO(userId),
      email,
      notificationType,
      subject,
      htmlContent,
      status,
      createdAt,
      updatedAt,
      relatedEntityId ? new IdVO(relatedEntityId) : undefined,
      sentAt,
      failureReason,
    );
  }

  getId(): string {
    return this.id.getValue();
  }

  getUserId(): string {
    return this.userId.getValue();
  }

  getEmail(): string {
    return this.email;
  }

  getNotificationType(): NotificationType {
    return this.notificationType;
  }

  getSubject(): string {
    return this.subject;
  }

  getHtmlContent(): string {
    return this.htmlContent;
  }

  getRelatedEntityId(): string | undefined {
    return this.relatedEntityId?.getValue();
  }

  getStatus(): NotificationStatus {
    return this.status;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  getSentAt(): Date | undefined {
    return this.sentAt;
  }

  getFailureReason(): string | undefined {
    return this.failureReason;
  }

  markAsSent(): void {
    if (this.status !== NotificationStatus.PENDING) {
      throw new InvalidNotificationStateException(
        `Cannot mark notification as sent. Current status: ${this.status}`,
      );
    }
    this.status = NotificationStatus.SENT;
    this.sentAt = new Date();
    this.updatedAt = new Date();
  }

  markAsFailed(reason: string): void {
    if (this.status !== NotificationStatus.PENDING) {
      throw new InvalidNotificationStateException(
        `Cannot mark notification as failed. Current status: ${this.status}`,
      );
    }
    this.status = NotificationStatus.FAILED;
    this.failureReason = reason;
    this.updatedAt = new Date();
  }

  private validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new InvalidEmailException(email);
    }
  }
}
