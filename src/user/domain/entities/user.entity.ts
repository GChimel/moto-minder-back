import { Email } from '../value-objects/email.vo';
import { UserId } from '../value-objects/user-id.vo';

export class User {
  constructor(
    private readonly id: UserId,
    private name: string,
    private email: Email,
    private readonly createdAt: Date,
    private updatedAt: Date,
  ) {}

  static create(name: string, email: string) {
    if (!name || name.trim().length < 2) {
      throw new Error(
        'Name is required and must be at least 2 characters long',
      );
    }

    return new User(
      new UserId(),
      name.trim(),
      new Email(email),
      new Date(),
      new Date(),
    );
  }

  getId(): UserId {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getEmail(): Email {
    return this.email;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  updateName(name: string) {
    if (!name || name.trim().length < 2) {
      throw new Error(
        'Name is required and must be at least 2 characters long',
      );
    }
    this.name = name.trim();
    this.updatedAt = new Date();
  }

  updateEmail(email: string) {
    this.email = new Email(email);
    this.updatedAt = new Date();
  }

  getAccoutAge(): number {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - this.createdAt.getTime());

    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}
