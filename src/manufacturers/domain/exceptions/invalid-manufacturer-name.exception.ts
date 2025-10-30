export class InvalidManufacturerNameException extends Error {
  constructor(
    message: string = 'Name is required and must be at least 2 characters long',
  ) {
    super(message);
    this.name = 'InvalidManufacturerNameException';
  }
}
