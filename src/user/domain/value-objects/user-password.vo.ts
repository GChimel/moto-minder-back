import { compare, hash } from 'bcrypt';

export class UserPassword {
  private constructor(public readonly hash: string) {}

  public static async create(
    value: string | null,
  ): Promise<UserPassword | null> {
    if (!value) {
      console.log('aqui');
      return null;
    }

    if (value && value.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    const hashedPassword = await hash(value, 8);

    return new UserPassword(hashedPassword);
  }

  public async compare(value: string) {
    return await compare(value, this.hash);
  }

  public getValue(): string {
    return this.hash;
  }
}
