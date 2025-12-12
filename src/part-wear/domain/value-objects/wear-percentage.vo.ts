export class WearPercentage {
  private readonly value: number;

  private constructor(value: number) {
    this.validate(value);
    this.value = value;
  }

  static create(value: number): WearPercentage {
    return new WearPercentage(value);
  }

  static zero(): WearPercentage {
    return new WearPercentage(0);
  }

  static full(): WearPercentage {
    return new WearPercentage(100);
  }

  private validate(value: number): void {
    if (!Number.isFinite(value)) {
      throw new Error('Wear percentage must be a finite number');
    }
    if (value < 0 || value > 100) {
      throw new Error('Wear percentage must be between 0 and 100');
    }
  }

  getValue(): number {
    return this.value;
  }

  isAboveThreshold(threshold: number): boolean {
    return this.value >= threshold;
  }

  isMaintenanceDue(threshold: number = 70): boolean {
    return this.isAboveThreshold(threshold);
  }

  equals(other: WearPercentage): boolean {
    return this.value === other.getValue();
  }

  toString(): string {
    return `${this.value.toFixed(2)}%`;
  }
}
