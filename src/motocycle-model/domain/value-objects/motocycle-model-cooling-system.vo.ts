import { CoolingSystem } from '../enums/cooling-system.enum';
import { InvalidCoolingSystemException } from '../exceptions/invalid-cooling-system.exception';

export class MotocycleCoolingSystem {
  private readonly value: string;

  constructor(coolingSystem: string) {
    if (!this.isValid(coolingSystem)) {
      throw new InvalidCoolingSystemException(coolingSystem);
    }
    this.value = coolingSystem;
  }

  private isValid(coolingSystem: string): boolean {
    return Object.values(CoolingSystem).includes(
      coolingSystem as CoolingSystem,
    );
  }

  getValue(): string {
    return this.value;
  }

  equals(other: MotocycleCoolingSystem): boolean {
    return this.value === other.getValue();
  }
}
