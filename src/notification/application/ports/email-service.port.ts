export interface EmailContent {
  to: string;
  subject: string;
  html: string;
}

export interface IOEmailService {
  sendEmail(content: EmailContent): Promise<void>;
}

export const EMAIL_SERVICE = 'EMAIL_SERVICE';
