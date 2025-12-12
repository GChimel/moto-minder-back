import { PartWear } from '../../domain/entities/part-wear.entity';

export class PartWearResponseDto {
  id: string;
  motorcyclePartId: string;
  currentWearPercentage: number;
  lastCalculatedAt: string;
  lastKnownOdometer: number;
  projectedReplacementOdometer: number;
  projectedReplacementDate?: string;
  isMaintenanceDue: boolean;
  createdAt: string;
  updatedAt: string;

  constructor(partWear: PartWear) {
    this.id = partWear.getId().getValue();
    this.motorcyclePartId = partWear.getMotorcyclePartId().getValue();
    this.currentWearPercentage = partWear.getCurrentWearPercentage().getValue();
    this.lastCalculatedAt = partWear.getLastCalculatedAt().toISOString();
    this.lastKnownOdometer = partWear.getLastKnownOdometer().getValue();
    this.projectedReplacementOdometer =
      partWear.getProjectedReplacementOdometer();
    this.projectedReplacementDate = partWear
      .getProjectedReplacementDate()
      ?.toISOString();
    this.isMaintenanceDue = partWear.isMaintenanceDueStatus();
    this.createdAt = partWear.getCreatedAt().toISOString();
    this.updatedAt = partWear.getUpdatedAt().toISOString();
  }

  static mapMultiple(partWears: PartWear[]): PartWearResponseDto[] {
    return partWears.map((pw) => new PartWearResponseDto(pw));
  }
}
