import { InvalidArgumentException } from '../../../shared/domain/exceptions/invalid-argument.exception';

export class FuelConsumed {
  private readonly liters: number;

  constructor(liters: number) {
    if (liters < 0) {
      throw new InvalidArgumentException(
        'fuelConsumed',
        'Fuel consumed cannot be negative',
      );
    }
    this.liters = liters;
  }

  getLiters(): number {
    return this.liters;
  }

  getGallons(): number {
    return this.liters * 0.264172;
  }

  calculateFuelEconomy(distanceKilometers: number): number | undefined {
    if (this.liters === 0 || distanceKilometers === 0) {
      return undefined;
    }

    return (this.liters / distanceKilometers) * 100;
  }

  equals(other: FuelConsumed): boolean {
    return this.liters === other.getLiters();
  }

  static zero(): FuelConsumed {
    return new FuelConsumed(0);
  }
}
