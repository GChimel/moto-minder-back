import { compare, hash } from 'bcrypt';
import { InvalidArgumentException } from '../../../shared/domain/exceptions/invalid-argument.exception';
import { User } from '../entities/user.entity';

export class UserPassword {
  private constructor(public readonly hash: string) {}

  public static async create(
    value: string | null,
  ): Promise<UserPassword | null> {
    if (!value) {
      return null;
    }

    if (value && value.length < 8) {
      throw new InvalidArgumentException(
        'password',
        'Password must be at least 8 characters long',
      );
    }

    const hashedPassword = await hash(value, 10);

    return new UserPassword(hashedPassword);
  }

  public static async compare(value: string, user: User): Promise<boolean> {
    const password = user.getPassword();

    if (!password) {
      return false;
    }

    const isPasswordValid = await compare(value, password);

    return isPasswordValid;
  }

  public getValue(): string {
    return this.hash;
  }
}
