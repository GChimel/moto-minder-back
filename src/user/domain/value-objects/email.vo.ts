export class Email {
  private readonly value: string;

  constructor(email: string) {
    if (!this.isValid(email)) {
      throw new Error('Invalid email format');
    }
    this.value = email;
  }

  private isValid(email: string): boolean {
    // RFC 5322 compliant email regex
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    if (!email || typeof email !== 'string') {
      return false;
    }

    if (email.length > 254) {
      return false; // Max email length per RFC 5321
    }

    return emailRegex.test(email.toLowerCase());
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Email): boolean {
    return this.value === other.getValue();
  }
}
