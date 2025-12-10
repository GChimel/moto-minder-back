import { InvalidArgumentException } from '../../../shared/domain/exceptions/invalid-argument.exception';

export class Distance {
  private readonly kilometers: number;

  constructor(kilometers: number) {
    if (kilometers < 0) {
      throw new InvalidArgumentException(
        'distance',
        'Distance cannot be negative',
      );
    }
    if (!Number.isInteger(kilometers)) {
      throw new InvalidArgumentException(
        'distance',
        'Distance must be an integer',
      );
    }
    this.kilometers = kilometers;
  }

  getKilometers(): number {
    return this.kilometers;
  }

  getMiles(): number {
    return this.kilometers * 0.621371;
  }

  equals(other: Distance): boolean {
    return this.kilometers === other.getKilometers();
  }

  static zero(): Distance {
    return new Distance(0);
  }
}
