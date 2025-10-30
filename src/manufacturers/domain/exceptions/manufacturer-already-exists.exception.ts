export class ManufacturerAlreadyExistsException extends Error {
  constructor(name: string) {
    super(`Manufacturer with name "${name}" already exists`);
    this.name = 'ManufacturerAlreadyExistsException';
  }
}
