import { BadRequestException } from '@nestjs/common';
import { Email } from '../value-objects/email.vo';
import { UserId } from '../value-objects/user-id.vo';
import { UserPassword } from '../value-objects/user-password.vo';

interface IUserModel {
  name: string;
  email: string;
  password?: string;
}

export class User {
  constructor(
    private readonly id: UserId,
    private name: string,
    private email: Email,
    private readonly createdAt: Date,
    private updatedAt: Date,
    private password?: string,
  ) {}

  static async create(body: IUserModel) {
    if (!body.name || body.name.trim().length < 2) {
      throw new BadRequestException(
        'Name is required and must be at least 2 characters long',
      );
    }

    const password = await UserPassword.create(body.password || null);

    return new User(
      new UserId(),
      body.name.trim(),
      new Email(body.email),
      new Date(),
      new Date(),
      password?.getValue(),
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

  getPassword(): string | undefined {
    return this.password || undefined;
  }

  updateName(name: string) {
    if (!name || name.trim().length < 2) {
      throw new BadRequestException(
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

  updatePassword(hashedPassword: string) {
    this.password = hashedPassword;
    this.updatedAt = new Date();
  }

  getAccoutAge(): number {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - this.createdAt.getTime());

    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}
