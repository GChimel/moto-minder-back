import { InvalidArgumentException } from '../../../shared/domain/exceptions/invalid-argument.exception';

export interface PartLifespanData {
  lifespanKm?: number;
  lifespanMonths?: number;
}

export class PartLifespan {
  private readonly lifespanKm?: number;
  private readonly lifespanMonths?: number;

  constructor(data: PartLifespanData) {
    if (!data.lifespanKm && !data.lifespanMonths) {
      throw new InvalidArgumentException(
        'partLifespan',
        'At least one lifespan value (kilometers or months) must be specified',
      );
    }

    if (data.lifespanKm !== undefined) {
      if (data.lifespanKm < 1 || data.lifespanKm > 1000000) {
        throw new InvalidArgumentException(
          'lifespanKm',
          'Lifespan in kilometers must be between 1 and 1,000,000',
        );
      }
      if (!Number.isInteger(data.lifespanKm)) {
        throw new InvalidArgumentException(
          'lifespanKm',
          'Lifespan in kilometers must be an integer',
        );
      }
    }

    if (data.lifespanMonths !== undefined) {
      if (data.lifespanMonths < 1 || data.lifespanMonths > 120) {
        throw new InvalidArgumentException(
          'lifespanMonths',
          'Lifespan in months must be between 1 and 120',
        );
      }
      if (!Number.isInteger(data.lifespanMonths)) {
        throw new InvalidArgumentException(
          'lifespanMonths',
          'Lifespan in months must be an integer',
        );
      }
    }

    this.lifespanKm = data.lifespanKm;
    this.lifespanMonths = data.lifespanMonths;
  }

  getValue(): PartLifespanData {
    return {
      lifespanKm: this.lifespanKm,
      lifespanMonths: this.lifespanMonths,
    };
  }

  getLifespanKm(): number | undefined {
    return this.lifespanKm;
  }

  getLifespanMonths(): number | undefined {
    return this.lifespanMonths;
  }

  getKm(): number | undefined {
    return this.lifespanKm;
  }

  getMonths(): number | undefined {
    return this.lifespanMonths;
  }

  equals(other: PartLifespan): boolean {
    return (
      this.lifespanKm === other.getKm() &&
      this.lifespanMonths === other.getMonths()
    );
  }
}
