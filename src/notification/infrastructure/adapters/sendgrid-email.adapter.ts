import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  IOEmailService,
  EmailContent,
} from '../../application/ports/email-service.port';

@Injectable()
export class SendGridEmailAdapter implements IOEmailService {
  private readonly logger = new Logger(SendGridEmailAdapter.name);
  private readonly fromEmail: string;
  private readonly sendGridApiKey: string;
  private readonly sendGridApiUrl = 'https://api.sendgrid.com/v3/mail/send';

  constructor(private configService: ConfigService) {
    this.fromEmail = this.configService.get<string>(
      'SENDGRID_FROM_EMAIL',
      'noreply@moto-minder.com',
    );
    this.sendGridApiKey = this.configService.get<string>(
      'SENDGRID_API_KEY',
      '',
    );

    if (!this.sendGridApiKey) {
      this.logger.warn(
        'SendGrid API key not configured. Email sending will be disabled.',
      );
    }
  }

  async sendEmail(content: EmailContent): Promise<void> {
    if (!this.sendGridApiKey) {
      this.logger.debug(
        `[MOCK] Would send email to ${content.to} with subject: ${content.subject}`,
      );
      return;
    }

    try {
      await this.sendViaHttpRequest(content);
      this.logger.log(`Email sent successfully to ${content.to}`);
    } catch (error) {
      this.logger.error(
        `Failed to send email to ${content.to}`,
        error instanceof Error ? error.message : 'Unknown error',
      );
      throw new BadRequestException(
        `Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  private async sendViaHttpRequest(content: EmailContent): Promise<void> {
    const payload = {
      personalizations: [
        {
          to: [{ email: content.to }],
        },
      ],
      from: { email: this.fromEmail },
      subject: content.subject,
      content: [
        {
          type: 'text/html',
          value: content.html,
        },
      ],
    };

    const response = await fetch(this.sendGridApiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.sendGridApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`SendGrid API error (${response.status}): ${errorText}`);
    }
  }
}
