import { Injectable, Inject } from '@nestjs/common';
import {
  PART_WEAR_REPOSITORY,
  PartWearRepositoryPort,
} from '../ports/part-wear.repository.port';
import { WearCalculationService } from '../../domain/services/wear-calculation.service';
import { PartWear } from '../../domain/entities/part-wear.entity';
import { Odometer } from '../../../shared/domain/value-objects/odometer.vo';
import {
  PartWearNotFoundException,
  InvalidWearCalculationException,
} from '../../domain/exceptions/part-wear.exceptions';
import {
  MOTORCYCLE_PART_REPOSITORY,
  MotorcyclePartRepositoryPort,
} from '../../../motorcycle-part/application/ports/motorcycle-part.repository.port';

export interface CalculatePartWearResult {
  partWear: PartWear;
  wearChanged: boolean;
  previousWearPercentage: number;
  currentWearPercentage: number;
}

@Injectable()
export class CalculatePartWearUseCase {
  private readonly wearCalculationService: WearCalculationService;

  constructor(
    @Inject(PART_WEAR_REPOSITORY)
    private readonly partWearRepository: PartWearRepositoryPort,
    @Inject(MOTORCYCLE_PART_REPOSITORY)
    private readonly motorcyclePartRepository: MotorcyclePartRepositoryPort,
  ) {
    this.wearCalculationService = new WearCalculationService();
  }

  async execute(
    partWearId: string,
    currentOdometer: number,
  ): Promise<CalculatePartWearResult> {
    if (currentOdometer < 0) {
      throw new InvalidWearCalculationException(
        'Current odometer cannot be negative',
      );
    }

    const partWear = await this.partWearRepository.findById(partWearId);
    if (!partWear) {
      throw new PartWearNotFoundException(partWearId);
    }

    const motorcyclePart = await this.motorcyclePartRepository.findById(
      partWear.getMotorcyclePartId().getValue(),
    );
    if (!motorcyclePart) {
      throw new InvalidWearCalculationException(
        `Motorcycle part not found for part wear ${partWearId}`,
      );
    }

    if (!motorcyclePart.getIsActive()) {
      throw new InvalidWearCalculationException(
        `Motorcycle part is no longer active`,
      );
    }

    const previousWearPercentage = partWear
      .getCurrentWearPercentage()
      .getValue();
    const currentOdometerVo = new Odometer(currentOdometer);

    const calculationResult = this.wearCalculationService.calculateWear(
      motorcyclePart,
      currentOdometerVo,
    );

    const currentWearPercentage = calculationResult.wearPercentage.getValue();
    const wearChanged = previousWearPercentage !== currentWearPercentage;

    partWear.updateWear(
      calculationResult.wearPercentage,
      currentOdometerVo,
      calculationResult.projectedReplacementKm,
      calculationResult.isMaintenanceDue,
      calculationResult.projectedReplacementDate,
    );

    const updatedPartWear = await this.partWearRepository.save(partWear);

    return {
      partWear: updatedPartWear,
      wearChanged,
      previousWearPercentage,
      currentWearPercentage,
    };
  }
}
