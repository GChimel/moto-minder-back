import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationSchema } from './infrastructure/persistence/notification.schema';
import { TypeOrmNotificationRepository } from './infrastructure/adapters/typeorm-notification.repository';
import { SendGridEmailAdapter } from './infrastructure/adapters/sendgrid-email.adapter';
import { SendMaintenanceAlertUseCase } from './application/use-cases/send-maintenance-alert.use-case';
import { NOTIFICATION_REPOSITORY } from './application/ports/notification.repository.port';
import { EMAIL_SERVICE } from './application/ports/email-service.port';
import { NotificationController } from './presentation/notification.controller';
import { OnMaintenanceThresholdCrossedListener } from './application/listeners/on-maintenance-threshold-crossed.listener';
import { MotorcyclePartModule } from '../motorcycle-part/motorcycle-part.module';
import { UserMotocycleModule } from '../user-motocycle/user-motocycle.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationSchema]),
    MotorcyclePartModule,
    UserMotocycleModule,
    UserModule,
  ],
  providers: [
    {
      provide: NOTIFICATION_REPOSITORY,
      useClass: TypeOrmNotificationRepository,
    },
    {
      provide: EMAIL_SERVICE,
      useClass: SendGridEmailAdapter,
    },
    SendMaintenanceAlertUseCase,
    OnMaintenanceThresholdCrossedListener,
  ],
  controllers: [NotificationController],
  exports: [
    NOTIFICATION_REPOSITORY,
    EMAIL_SERVICE,
    SendMaintenanceAlertUseCase,
  ],
})
export class NotificationModule {}
