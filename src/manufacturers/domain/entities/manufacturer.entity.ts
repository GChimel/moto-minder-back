import { IdVO } from '../../../shared/infrastructure/domain/value-objects/id-vo';
import { InvalidManufacturerNameException } from '../exceptions/invalid-manufacturer-name.exception';

export class Manufacturer {
  constructor(
    private readonly id: IdVO,
    private name: string,
  ) {}

  static create(name: string): Manufacturer {
    if (!name || name.trim().length < 2) {
      throw new InvalidManufacturerNameException();
    }

    return new Manufacturer(new IdVO(), name.trim());
  }

  static reconstitute(id: string, name: string): Manufacturer {
    return new Manufacturer(new IdVO(id), name);
  }

  getId(): IdVO {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  updateName(name: string): void {
    if (!name || name.trim().length < 2) {
      throw new InvalidManufacturerNameException();
    }
    this.name = name.trim();
  }
}
