export class Odometer {
  private static readonly MAX_ODOMETER = 1000000; // 1 million km is reasonable max
  private readonly value: number;

  constructor(odometer: number) {
    this.validate(odometer);
    this.value = odometer;
  }

  private validate(odometer: number): void {
    if (odometer < 0) {
      throw new Error('Odometer cannot be negative');
    }

    if (odometer > Odometer.MAX_ODOMETER) {
      throw new Error(
        `Odometer cannot exceed ${Odometer.MAX_ODOMETER} kilometers`,
      );
    }

    if (!Number.isInteger(odometer)) {
      throw new Error('Odometer must be an integer value');
    }
  }

  public getValue(): number {
    return this.value;
  }

  public equals(other: Odometer): boolean {
    return this.value === other.getValue();
  }

  public isGreaterThan(other: Odometer): boolean {
    return this.value > other.getValue();
  }

  public isLessThan(other: Odometer): boolean {
    return this.value < other.getValue();
  }
}
