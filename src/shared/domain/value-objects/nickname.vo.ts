export class Nickname {
  private static readonly MIN_LENGTH = 2;
  private static readonly MAX_LENGTH = 100;
  private readonly value: string;

  constructor(nickname: string) {
    this.validate(nickname);
    this.value = nickname.trim();
  }

  private validate(nickname: string): void {
    if (!nickname || nickname.trim().length < Nickname.MIN_LENGTH) {
      throw new Error(
        `Nickname must be at least ${Nickname.MIN_LENGTH} characters long`,
      );
    }

    if (nickname.trim().length > Nickname.MAX_LENGTH) {
      throw new Error(
        `Nickname cannot exceed ${Nickname.MAX_LENGTH} characters`,
      );
    }
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: Nickname): boolean {
    return this.value === other.getValue();
  }
}
