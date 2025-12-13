import {
  Notification,
  NotificationType,
  NotificationStatus,
} from './notification.entity';
import {
  InvalidEmailException,
  InvalidNotificationStateException,
} from '../exceptions/notification.exceptions';
import { IdVO } from '../../../shared/infrastructure/domain/value-objects/id-vo';

describe('Notification Entity', () => {
  const validInput = {
    userId: new IdVO().getValue(),
    email: 'test@example.com',
    notificationType: NotificationType.MAINTENANCE_ALERT,
    subject: 'Maintenance Alert',
    htmlContent: '<h1>Test</h1>',
  };

  describe('create', () => {
    it('should create a new notification with pending status', () => {
      const notification = Notification.create(validInput);

      expect(notification.getId()).toBeDefined();
      expect(notification.getUserId()).toBe(validInput.userId);
      expect(notification.getEmail()).toBe(validInput.email);
      expect(notification.getNotificationType()).toBe(
        validInput.notificationType,
      );
      expect(notification.getSubject()).toBe(validInput.subject);
      expect(notification.getHtmlContent()).toBe(validInput.htmlContent);
      expect(notification.getStatus()).toBe(NotificationStatus.PENDING);
    });

    it('should throw InvalidEmailException for invalid email', () => {
      const invalidInput = {
        ...validInput,
        email: 'invalid-email',
      };

      expect(() => Notification.create(invalidInput)).toThrow(
        InvalidEmailException,
      );
    });
  });

  describe('reconstitute', () => {
    it('should reconstitute a notification from database values', () => {
      const id = new IdVO().getValue();
      const notification = Notification.reconstitute(
        id,
        validInput.userId,
        validInput.email,
        validInput.notificationType,
        validInput.subject,
        validInput.htmlContent,
        NotificationStatus.SENT,
        new Date('2024-01-01'),
        new Date('2024-01-02'),
      );

      expect(notification.getId()).toBe(id);
      expect(notification.getStatus()).toBe(NotificationStatus.SENT);
    });
  });

  describe('markAsSent', () => {
    it('should mark notification as sent', () => {
      const notification = Notification.create(validInput);

      notification.markAsSent();

      expect(notification.getStatus()).toBe(NotificationStatus.SENT);
      expect(notification.getSentAt()).toBeDefined();
    });

    it('should throw error if notification is not pending', () => {
      const id = new IdVO().getValue();
      const notification = Notification.reconstitute(
        id,
        validInput.userId,
        validInput.email,
        validInput.notificationType,
        validInput.subject,
        validInput.htmlContent,
        NotificationStatus.SENT,
        new Date(),
        new Date(),
      );

      expect(() => notification.markAsSent()).toThrow(
        InvalidNotificationStateException,
      );
    });
  });

  describe('markAsFailed', () => {
    it('should mark notification as failed with reason', () => {
      const notification = Notification.create(validInput);
      const failureReason = 'Email service unavailable';

      notification.markAsFailed(failureReason);

      expect(notification.getStatus()).toBe(NotificationStatus.FAILED);
      expect(notification.getFailureReason()).toBe(failureReason);
    });

    it('should throw error if notification is not pending', () => {
      const id = new IdVO().getValue();
      const notification = Notification.reconstitute(
        id,
        validInput.userId,
        validInput.email,
        validInput.notificationType,
        validInput.subject,
        validInput.htmlContent,
        NotificationStatus.FAILED,
        new Date(),
        new Date(),
      );

      expect(() => notification.markAsFailed('error')).toThrow(
        InvalidNotificationStateException,
      );
    });
  });

  describe('getters', () => {
    it('should return all notification properties', () => {
      const notification = Notification.create({
        ...validInput,
        relatedEntityId: new IdVO().getValue(),
      });

      expect(notification.getId()).toBeDefined();
      expect(notification.getUserId()).toBe(validInput.userId);
      expect(notification.getEmail()).toBe(validInput.email);
      expect(notification.getNotificationType()).toBe(
        validInput.notificationType,
      );
      expect(notification.getSubject()).toBe(validInput.subject);
      expect(notification.getHtmlContent()).toBe(validInput.htmlContent);
      expect(notification.getStatus()).toBe(NotificationStatus.PENDING);
      expect(notification.getCreatedAt()).toBeDefined();
      expect(notification.getUpdatedAt()).toBeDefined();
    });
  });

  describe('email validation', () => {
    it('should accept valid email formats', () => {
      const validEmails = [
        'test@example.com',
        'user.name@example.co.uk',
        'test+tag@example.com',
      ];

      validEmails.forEach((email) => {
        const notification = Notification.create({
          ...validInput,
          email,
        });
        expect(notification.getEmail()).toBe(email);
      });
    });

    it('should reject invalid email formats', () => {
      const invalidEmails = [
        'invalid',
        'invalid@',
        '@example.com',
        'invalid@.com',
        'invalid @example.com',
      ];

      invalidEmails.forEach((email) => {
        expect(() =>
          Notification.create({
            ...validInput,
            email,
          }),
        ).toThrow(InvalidEmailException);
      });
    });
  });
});
