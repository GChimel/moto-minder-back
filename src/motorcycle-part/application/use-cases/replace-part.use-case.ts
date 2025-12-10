import { Injectable, Inject } from '@nestjs/common';
import { MotorcyclePart } from '../../domain/entities/motorcycle-part.entity';
import {
  MOTORCYCLE_PART_REPOSITORY,
  MotorcyclePartRepositoryPort,
} from '../ports/motorcycle-part.repository.port';
import { MotorcyclePartNotFoundException } from '../../domain/exceptions/motorcycle-part-exceptions';

export interface ReplacePartData {
  expectedLifespanKm?: number;
  expectedLifespanMonths?: number;
  wearRatePerKm?: number;
  replacementThreshold?: number;
  notes?: string;
}

export interface ReplacePartResult {
  oldPart: MotorcyclePart;
  newPart: MotorcyclePart;
}

@Injectable()
export class ReplacePartUseCase {
  constructor(
    @Inject(MOTORCYCLE_PART_REPOSITORY)
    private readonly repository: MotorcyclePartRepositoryPort,
  ) {}

  async execute(
    partId: string,
    newPartData: ReplacePartData,
  ): Promise<ReplacePartResult> {
    const oldPart = await this.repository.findById(partId);

    if (!oldPart) {
      throw new MotorcyclePartNotFoundException(partId);
    }

    oldPart.markAsReplaced();
    await this.repository.save(oldPart);

    const newPart = MotorcyclePart.create({
      userMotocycleId: oldPart.getUserMotocycleId().getValue(),
      partType: oldPart.getPartType(),
      partCategory: oldPart.getPartCategory(),
      name: oldPart.getName(),
      manufacturer: oldPart.getManufacturer(),
      model: oldPart.getModel(),
      installationDate: new Date(),
      installationOdometer: oldPart.getInstallationOdometer().getValue(),
      expectedLifespanKm: newPartData.expectedLifespanKm,
      expectedLifespanMonths: newPartData.expectedLifespanMonths,
      wearRatePerKm: newPartData.wearRatePerKm,
      replacementThreshold: newPartData.replacementThreshold,
      notes: newPartData.notes,
    });

    const savedNewPart = await this.repository.save(newPart);

    return {
      oldPart,
      newPart: savedNewPart,
    };
  }
}
