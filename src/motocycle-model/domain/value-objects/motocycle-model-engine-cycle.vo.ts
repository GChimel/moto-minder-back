import { EngineCycle } from '../enums/engine-cycle.enum';
import { InvalidEngineCycleException } from '../exceptions/invalid-engine-cycle.exception';

export class MotocycleEngineCycle {
  private readonly value: string;

  constructor(engineCycle: string) {
    if (!this.isValid(engineCycle)) {
      throw new InvalidEngineCycleException(engineCycle);
    }
    this.value = engineCycle;
  }

  private isValid(engineCycle: string): boolean {
    return Object.values(EngineCycle).includes(engineCycle as EngineCycle);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: MotocycleEngineCycle): boolean {
    return this.value === other.getValue();
  }
}
