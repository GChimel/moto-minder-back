import { InvalidArgumentException } from '../../../shared/domain/exceptions/invalid-argument.exception';

export interface ServiceIntervalData {
  intervalKm?: number;
  intervalMonths?: number;
}

export class ServiceInterval {
  private readonly intervalKm?: number;
  private readonly intervalMonths?: number;

  constructor(data: ServiceIntervalData) {
    if (!data.intervalKm && !data.intervalMonths) {
      throw new InvalidArgumentException(
        'serviceInterval',
        'At least one interval (km or months) must be specified',
      );
    }

    if (data.intervalKm !== undefined && data.intervalKm <= 0) {
      throw new InvalidArgumentException(
        'intervalKm',
        'Interval in kilometers must be greater than 0',
      );
    }

    if (data.intervalMonths !== undefined && data.intervalMonths <= 0) {
      throw new InvalidArgumentException(
        'intervalMonths',
        'Interval in months must be greater than 0',
      );
    }

    this.intervalKm = data.intervalKm;
    this.intervalMonths = data.intervalMonths;
  }

  getIntervalKm(): number | undefined {
    return this.intervalKm;
  }

  getIntervalMonths(): number | undefined {
    return this.intervalMonths;
  }

  calculateNextServiceDueOdometer(currentOdometer: number): number | undefined {
    if (!this.intervalKm) {
      return undefined;
    }
    return currentOdometer + this.intervalKm;
  }

  calculateNextServiceDueDate(): Date | undefined {
    if (!this.intervalMonths) {
      return undefined;
    }

    const nextDate = new Date();
    nextDate.setMonth(nextDate.getMonth() + this.intervalMonths);
    return nextDate;
  }

  equals(other: ServiceInterval): boolean {
    return (
      this.intervalKm === other.getIntervalKm() &&
      this.intervalMonths === other.getIntervalMonths()
    );
  }
}
