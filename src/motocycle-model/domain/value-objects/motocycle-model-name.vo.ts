import { InvalidMotocycleModelNameException } from '../exceptions/invalid-motocycle-model-name.exception';

export class MotocycleModelName {
  private readonly value: string;

  constructor(name: string) {
    if (!name || name.trim().length < 3) {
      throw new InvalidMotocycleModelNameException();
    }
    this.value = name.trim();
  }

  getValue(): string {
    return this.value;
  }

  equals(other: MotocycleModelName): boolean {
    return this.value === other.getValue();
  }
}
