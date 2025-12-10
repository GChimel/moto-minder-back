import { InvalidArgumentException } from '../../../shared/domain/exceptions/invalid-argument.exception';

export class WearRate {
  private static readonly MIN_WEAR_RATE = 0.00001;
  private static readonly MAX_WEAR_RATE = 1;
  private readonly value: number;

  constructor(wearRatePerKm: number) {
    if (
      wearRatePerKm < WearRate.MIN_WEAR_RATE ||
      wearRatePerKm > WearRate.MAX_WEAR_RATE
    ) {
      throw new InvalidArgumentException(
        'wearRatePerKm',
        `Wear rate must be between ${WearRate.MIN_WEAR_RATE}% and ${WearRate.MAX_WEAR_RATE}%`,
      );
    }

    this.value = wearRatePerKm;
  }

  getValue(): number {
    return this.value;
  }

  equals(other: WearRate): boolean {
    return this.value === other.getValue();
  }
}
