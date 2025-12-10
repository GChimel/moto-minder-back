export class Year {
  private static readonly MIN_YEAR = 1900;
  private readonly value: number;

  constructor(year: number) {
    this.validate(year);
    this.value = year;
  }

  private validate(year: number): void {
    const currentYear = new Date().getFullYear();
    const maxYear = currentYear + 1; // Allow next year for upcoming models

    if (year < Year.MIN_YEAR) {
      throw new Error(`Year cannot be before ${Year.MIN_YEAR}`);
    }

    if (year > maxYear) {
      throw new Error(`Year cannot be after ${maxYear}`);
    }

    if (!Number.isInteger(year)) {
      throw new Error('Year must be an integer value');
    }
  }

  public getValue(): number {
    return this.value;
  }

  public equals(other: Year): boolean {
    return this.value === other.getValue();
  }

  public isAfter(other: Year): boolean {
    return this.value > other.getValue();
  }

  public isBefore(other: Year): boolean {
    return this.value < other.getValue();
  }
}
