export class ManufacturerNotFoundException extends Error {
  constructor(identifier: string) {
    super(`Manufacturer with identifier "${identifier}" not found`);
    this.name = 'ManufacturerNotFoundException';
  }
}
