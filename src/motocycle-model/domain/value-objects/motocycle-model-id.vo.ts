import { randomUUID } from 'crypto';

export class MotocycleModelId {
  private readonly value: string;

  constructor(id?: string) {
    this.value = id || randomUUID();
  }

  getValue(): string {
    return this.value;
  }

  equals(other: MotocycleModelId): boolean {
    return this.value === other.getValue();
  }
}
