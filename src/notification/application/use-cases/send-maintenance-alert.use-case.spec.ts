import {
  SendMaintenanceAlertUseCase,
  SendMaintenanceAlertInput,
} from './send-maintenance-alert.use-case';
import { NotificationRepositoryPort } from '../ports/notification.repository.port';
import { IOEmailService } from '../ports/email-service.port';
import { IdVO } from '../../../shared/infrastructure/domain/value-objects/id-vo';
import { BadRequestException } from '@nestjs/common';

describe('SendMaintenanceAlertUseCase', () => {
  let useCase: SendMaintenanceAlertUseCase;
  let mockNotificationRepository: jest.Mocked<NotificationRepositoryPort>;
  let mockEmailService: jest.Mocked<IOEmailService>;

  beforeEach(() => {
    mockNotificationRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByUserId: jest.fn(),
      findPending: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<NotificationRepositoryPort>;

    mockEmailService = {
      sendEmail: jest.fn(),
    } as unknown as jest.Mocked<IOEmailService>;

    useCase = new SendMaintenanceAlertUseCase(
      mockNotificationRepository,
      mockEmailService,
    );
  });

  describe('execute', () => {
    it('should send maintenance alert and create notification', async () => {
      const input: SendMaintenanceAlertInput = {
        userId: new IdVO().getValue(),
        userEmail: 'rider@example.com',
        motorcycleName: 'Honda CB500F',
        partName: 'Front Tire',
        wearPercentage: 75,
        replacementThreshold: 70,
        projectedReplacementKm: 15000,
        partId: new IdVO().getValue(),
      };

      const mockNotification = {
        getId: jest.fn().mockReturnValue(new IdVO().getValue()),
        getUserId: jest.fn().mockReturnValue(input.userId),
        getEmail: jest.fn().mockReturnValue(input.userEmail),
        getNotificationType: jest.fn(),
        getSubject: jest.fn(),
        getHtmlContent: jest.fn(),
        getStatus: jest.fn(),
        getCreatedAt: jest.fn(),
        getUpdatedAt: jest.fn(),
        getSentAt: jest.fn(),
        getFailureReason: jest.fn(),
        markAsSent: jest.fn(),
        getRelatedEntityId: jest.fn(),
      };

      mockNotificationRepository.save.mockResolvedValue(
        mockNotification as any,
      );
      mockEmailService.sendEmail.mockResolvedValue(undefined);

      const result = await useCase.execute(input);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockNotificationRepository.save).toHaveBeenCalledTimes(2);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockEmailService.sendEmail).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should include part details in email subject', async () => {
      const input: SendMaintenanceAlertInput = {
        userId: new IdVO().getValue(),
        userEmail: 'rider@example.com',
        motorcycleName: 'Honda CB500F',
        partName: 'Brake Pads',
        wearPercentage: 85,
        replacementThreshold: 70,
        projectedReplacementKm: 5000,
        partId: new IdVO().getValue(),
      };

      const mockNotification = {
        getId: jest.fn().mockReturnValue(new IdVO().getValue()),
        getUserId: jest.fn().mockReturnValue(input.userId),
        getEmail: jest.fn().mockReturnValue(input.userEmail),
        getNotificationType: jest.fn(),
        getSubject: jest.fn(),
        getHtmlContent: jest.fn(),
        getStatus: jest.fn(),
        getCreatedAt: jest.fn(),
        getUpdatedAt: jest.fn(),
        getSentAt: jest.fn(),
        getFailureReason: jest.fn(),
        markAsSent: jest.fn(),
        getRelatedEntityId: jest.fn(),
      };

      mockNotificationRepository.save.mockResolvedValue(
        mockNotification as any,
      );
      mockEmailService.sendEmail.mockResolvedValue(undefined);

      await useCase.execute(input);

      const emailCall = mockEmailService.sendEmail.mock.calls[0][0];
      expect(emailCall.subject).toContain('Brake Pads');
      expect(emailCall.subject).toContain('Honda CB500F');
    });

    it('should include wear percentage in email content', async () => {
      const input: SendMaintenanceAlertInput = {
        userId: new IdVO().getValue(),
        userEmail: 'rider@example.com',
        motorcycleName: 'Yamaha MT-09',
        partName: 'Chain',
        wearPercentage: 65,
        replacementThreshold: 70,
        projectedReplacementKm: 8000,
        partId: new IdVO().getValue(),
      };

      const mockNotification = {
        getId: jest.fn().mockReturnValue(new IdVO().getValue()),
        getUserId: jest.fn().mockReturnValue(input.userId),
        getEmail: jest.fn().mockReturnValue(input.userEmail),
        getNotificationType: jest.fn(),
        getSubject: jest.fn(),
        getHtmlContent: jest.fn(),
        getStatus: jest.fn(),
        getCreatedAt: jest.fn(),
        getUpdatedAt: jest.fn(),
        getSentAt: jest.fn(),
        getFailureReason: jest.fn(),
        markAsSent: jest.fn(),
        getRelatedEntityId: jest.fn(),
      };

      mockNotificationRepository.save.mockResolvedValue(
        mockNotification as any,
      );
      mockEmailService.sendEmail.mockResolvedValue(undefined);

      await useCase.execute(input);

      const emailCall = mockEmailService.sendEmail.mock.calls[0][0];
      expect(emailCall.html).toContain('65.0%');
      expect(emailCall.html).toContain('Chain');
    });

    it('should throw BadRequestException if email service fails', async () => {
      const input: SendMaintenanceAlertInput = {
        userId: new IdVO().getValue(),
        userEmail: 'rider@example.com',
        motorcycleName: 'Honda CB500F',
        partName: 'Front Tire',
        wearPercentage: 75,
        replacementThreshold: 70,
        projectedReplacementKm: 15000,
        partId: new IdVO().getValue(),
      };

      const mockNotification = {
        getId: jest.fn().mockReturnValue(new IdVO().getValue()),
        getUserId: jest.fn().mockReturnValue(input.userId),
        getEmail: jest.fn().mockReturnValue(input.userEmail),
        getNotificationType: jest.fn(),
        getSubject: jest.fn(),
        getHtmlContent: jest.fn(),
        getStatus: jest.fn(),
        getCreatedAt: jest.fn(),
        getUpdatedAt: jest.fn(),
        getSentAt: jest.fn(),
        getFailureReason: jest.fn(),
        markAsSent: jest.fn(),
        getRelatedEntityId: jest.fn(),
      };

      mockNotificationRepository.save.mockResolvedValue(
        mockNotification as any,
      );
      mockEmailService.sendEmail.mockRejectedValue(
        new Error('Email service error'),
      );

      await expect(useCase.execute(input)).rejects.toThrow(BadRequestException);
    });

    it('should handle high wear percentage with alert color', async () => {
      const input: SendMaintenanceAlertInput = {
        userId: new IdVO().getValue(),
        userEmail: 'rider@example.com',
        motorcycleName: 'Kawasaki Ninja',
        partName: 'Rear Tire',
        wearPercentage: 92,
        replacementThreshold: 70,
        projectedReplacementKm: 2000,
        partId: new IdVO().getValue(),
      };

      const mockNotification = {
        getId: jest.fn().mockReturnValue(new IdVO().getValue()),
        getUserId: jest.fn().mockReturnValue(input.userId),
        getEmail: jest.fn().mockReturnValue(input.userEmail),
        getNotificationType: jest.fn(),
        getSubject: jest.fn(),
        getHtmlContent: jest.fn(),
        getStatus: jest.fn(),
        getCreatedAt: jest.fn(),
        getUpdatedAt: jest.fn(),
        getSentAt: jest.fn(),
        getFailureReason: jest.fn(),
        markAsSent: jest.fn(),
        getRelatedEntityId: jest.fn(),
      };

      mockNotificationRepository.save.mockResolvedValue(
        mockNotification as any,
      );
      mockEmailService.sendEmail.mockResolvedValue(undefined);

      await useCase.execute(input);

      const emailCall = mockEmailService.sendEmail.mock.calls[0][0];
      expect(emailCall.html).toContain('#e74c3c');
    });
  });
});
