import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import {
  Notification,
  NotificationType,
} from '../../domain/entities/notification.entity';
import {
  NotificationRepositoryPort,
  NOTIFICATION_REPOSITORY,
} from '../ports/notification.repository.port';
import { EMAIL_SERVICE, IOEmailService } from '../ports/email-service.port';

export interface SendMaintenanceAlertInput {
  userId: string;
  userEmail: string;
  motorcycleName: string;
  partName: string;
  wearPercentage: number;
  replacementThreshold: number;
  projectedReplacementKm: number;
  partId: string;
}

@Injectable()
export class SendMaintenanceAlertUseCase {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notificationRepository: NotificationRepositoryPort,
    @Inject(EMAIL_SERVICE)
    private readonly emailService: IOEmailService,
  ) {}

  async execute(input: SendMaintenanceAlertInput): Promise<Notification> {
    try {
      const subject = `Maintenance Due: ${input.partName} on ${input.motorcycleName}`;
      const htmlContent = this.generateEmailHtml(input);

      const notification = Notification.create({
        userId: input.userId,
        email: input.userEmail,
        notificationType: NotificationType.MAINTENANCE_ALERT,
        subject,
        htmlContent,
        relatedEntityId: input.partId,
      });

      const savedNotification =
        await this.notificationRepository.save(notification);

      await this.emailService.sendEmail({
        to: input.userEmail,
        subject,
        html: htmlContent,
      });

      savedNotification.markAsSent();
      const sentNotification =
        await this.notificationRepository.save(savedNotification);

      return sentNotification;
    } catch (error) {
      throw new BadRequestException(
        `Failed to send maintenance alert: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  private generateEmailHtml(input: SendMaintenanceAlertInput): string {
    const wearStatusColor =
      input.wearPercentage >= input.replacementThreshold
        ? '#e74c3c'
        : '#f39c12';

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f5f5f5;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 20px auto;
              background-color: #ffffff;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              overflow: hidden;
            }
            .header {
              background-color: #34495e;
              color: #ffffff;
              padding: 30px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
              font-weight: bold;
            }
            .content {
              padding: 30px;
            }
            .alert-box {
              background-color: #fff3cd;
              border-left: 4px solid ${wearStatusColor};
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
            }
            .wear-indicator {
              margin: 20px 0;
              padding: 15px;
              background-color: #f8f9fa;
              border-radius: 4px;
            }
            .wear-bar {
              height: 30px;
              background-color: #e9ecef;
              border-radius: 15px;
              overflow: hidden;
              margin: 10px 0;
            }
            .wear-fill {
              height: 100%;
              background-color: ${wearStatusColor};
              width: ${Math.min(input.wearPercentage, 100)}%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #ffffff;
              font-weight: bold;
              font-size: 14px;
            }
            .details {
              margin: 20px 0;
            }
            .detail-row {
              display: flex;
              justify-content: space-between;
              padding: 10px 0;
              border-bottom: 1px solid #ecf0f1;
            }
            .detail-row:last-child {
              border-bottom: none;
            }
            .detail-label {
              font-weight: bold;
              color: #34495e;
            }
            .detail-value {
              color: #7f8c8d;
              text-align: right;
            }
            .cta-button {
              display: inline-block;
              background-color: #3498db;
              color: #ffffff;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 4px;
              margin: 20px 0;
              font-weight: bold;
            }
            .cta-button:hover {
              background-color: #2980b9;
            }
            .footer {
              background-color: #ecf0f1;
              padding: 20px;
              text-align: center;
              color: #7f8c8d;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⚠️ Maintenance Alert</h1>
            </div>
            <div class="content">
              <p>Hi there,</p>
              <p>Your <strong>${input.partName}</strong> on <strong>${input.motorcycleName}</strong> has reached ${input.wearPercentage.toFixed(1)}% wear and needs maintenance.</p>

              <div class="alert-box">
                <strong>Action Required:</strong> Please schedule maintenance soon to ensure safe riding and extend your motorcycle's lifespan.
              </div>

              <div class="wear-indicator">
                <div style="font-weight: bold; margin-bottom: 10px;">Current Wear Status</div>
                <div class="wear-bar">
                  <div class="wear-fill">${input.wearPercentage.toFixed(1)}%</div>
                </div>
              </div>

              <div class="details">
                <div class="detail-row">
                  <span class="detail-label">Part Name:</span>
                  <span class="detail-value">${input.partName}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Current Wear:</span>
                  <span class="detail-value">${input.wearPercentage.toFixed(1)}%</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Maintenance Threshold:</span>
                  <span class="detail-value">${input.replacementThreshold}%</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Estimated Replacement:</span>
                  <span class="detail-value">~${input.projectedReplacementKm} km</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Motorcycle:</span>
                  <span class="detail-value">${input.motorcycleName}</span>
                </div>
              </div>

              <p style="color: #7f8c8d; font-size: 14px;">
                This is an automated message from Moto-Minder. Your maintenance schedule helps keep your motorcycle in optimal condition and ensures your safety on the road.
              </p>
            </div>
            <div class="footer">
              <p>Moto-Minder Maintenance Tracking System</p>
              <p>Keep your ride safe and ready</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }
}
