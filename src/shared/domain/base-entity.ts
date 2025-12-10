export abstract class BaseEntity {
  protected readonly createdAt: Date;
  protected updatedAt: Date;

  protected constructor(createdAt?: Date, updatedAt?: Date) {
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  protected markAsUpdated(): void {
    this.updatedAt = new Date();
  }
}
