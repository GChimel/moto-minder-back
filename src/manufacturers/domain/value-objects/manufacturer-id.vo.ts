import { randomUUID } from 'crypto';

export class ManufacturerId {
  private readonly value: string;

  constructor(id?: string) {
    this.value = id || randomUUID();
  }

  getValue(): string {
    return this.value;
  }

  equals(other: ManufacturerId): boolean {
    return this.value === other.getValue();
  }
}
