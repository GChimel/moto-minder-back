export abstract class BaseDomainException extends Error {
  public readonly code: string;
  public readonly timestamp: Date;

  protected constructor(message: string, code: string) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.timestamp = new Date();
    Error.captureStackTrace(this, this.constructor);
  }

  public toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      timestamp: this.timestamp,
    };
  }
}
