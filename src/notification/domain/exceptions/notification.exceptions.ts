export class BaseDomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, BaseDomainException.prototype);
  }
}

export class InvalidEmailException extends BaseDomainException {
  constructor(email: string) {
    super(`Invalid email address: ${email}`);
    Object.setPrototypeOf(this, InvalidEmailException.prototype);
  }
}

export class NotificationSendFailedException extends BaseDomainException {
  constructor(message: string) {
    super(`Failed to send notification: ${message}`);
    Object.setPrototypeOf(this, NotificationSendFailedException.prototype);
  }
}

export class InvalidNotificationStateException extends BaseDomainException {
  constructor(message: string) {
    super(`Invalid notification state: ${message}`);
    Object.setPrototypeOf(this, InvalidNotificationStateException.prototype);
  }
}
