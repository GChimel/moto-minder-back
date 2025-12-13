import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationSchema } from '../persistence/notification.schema';
import { NotificationRepositoryPort } from '../../application/ports/notification.repository.port';
import {
  Notification,
  NotificationType,
  NotificationStatus,
} from '../../domain/entities/notification.entity';

@Injectable()
export class TypeOrmNotificationRepository
  implements NotificationRepositoryPort
{
  constructor(
    @InjectRepository(NotificationSchema)
    private readonly repository: Repository<NotificationSchema>,
  ) {}

  async save(notification: Notification): Promise<Notification> {
    const schema = {
      id: notification.getId(),
      userId: notification.getUserId(),
      email: notification.getEmail(),
      notificationType: notification.getNotificationType(),
      subject: notification.getSubject(),
      htmlContent: notification.getHtmlContent(),
      status: notification.getStatus(),
      relatedEntityId: notification.getRelatedEntityId(),
      createdAt: notification.getCreatedAt(),
      updatedAt: notification.getUpdatedAt(),
      sentAt: notification.getSentAt(),
      failureReason: notification.getFailureReason(),
    };

    await this.repository.save(schema);

    return notification;
  }

  async findById(id: string): Promise<Notification | null> {
    const schema = await this.repository.findOne({ where: { id } });

    if (!schema) {
      return null;
    }

    return this.mapSchemaToDomain(schema);
  }

  async findByUserId(userId: string): Promise<Notification[]> {
    const schemas = await this.repository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    return schemas.map((schema) => this.mapSchemaToDomain(schema));
  }

  async findPending(): Promise<Notification[]> {
    const schemas = await this.repository.find({
      where: { status: NotificationStatus.PENDING },
      order: { createdAt: 'ASC' },
    });

    return schemas.map((schema) => this.mapSchemaToDomain(schema));
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  private mapSchemaToDomain(schema: NotificationSchema): Notification {
    return Notification.reconstitute(
      schema.id,
      schema.userId,
      schema.email,
      schema.notificationType as NotificationType,
      schema.subject,
      schema.htmlContent,
      schema.status as NotificationStatus,
      schema.createdAt,
      schema.updatedAt,
      schema.relatedEntityId,
      schema.sentAt,
      schema.failureReason,
    );
  }
}
