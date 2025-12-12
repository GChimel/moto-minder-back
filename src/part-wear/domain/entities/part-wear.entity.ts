import { WearPercentage } from '../value-objects/wear-percentage.vo';
import { IdVO } from '../../../shared/infrastructure/domain/value-objects/id-vo';
import { Odometer } from '../../../shared/domain/value-objects/odometer.vo';

export interface PartWearProperties {
  id?: IdVO;
  motorcyclePartId: IdVO;
  currentWearPercentage: WearPercentage;
  lastCalculatedAt: Date;
  lastKnownOdometer: Odometer;
  projectedReplacementOdometer: number;
  projectedReplacementDate?: Date;
  isMaintenanceDue: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class PartWear {
  private readonly id: IdVO;
  private readonly motorcyclePartId: IdVO;
  private currentWearPercentage: WearPercentage;
  private lastCalculatedAt: Date;
  private lastKnownOdometer: Odometer;
  private projectedReplacementOdometer: number;
  private projectedReplacementDate?: Date;
  private isMaintenanceDue: boolean;
  private readonly createdAt: Date;
  private updatedAt: Date;

  private constructor(properties: PartWearProperties) {
    this.id = properties.id || new IdVO();
    this.motorcyclePartId = properties.motorcyclePartId;
    this.currentWearPercentage = properties.currentWearPercentage;
    this.lastCalculatedAt = properties.lastCalculatedAt;
    this.lastKnownOdometer = properties.lastKnownOdometer;
    this.projectedReplacementOdometer = properties.projectedReplacementOdometer;
    this.projectedReplacementDate = properties.projectedReplacementDate;
    this.isMaintenanceDue = properties.isMaintenanceDue;
    this.createdAt = properties.createdAt || new Date();
    this.updatedAt = properties.updatedAt || new Date();
  }

  static create(properties: PartWearProperties): PartWear {
    return new PartWear(properties);
  }

  static reconstitute(properties: PartWearProperties): PartWear {
    return new PartWear(properties);
  }

  getId(): IdVO {
    return this.id;
  }

  getMotorcyclePartId(): IdVO {
    return this.motorcyclePartId;
  }

  getCurrentWearPercentage(): WearPercentage {
    return this.currentWearPercentage;
  }

  getLastCalculatedAt(): Date {
    return this.lastCalculatedAt;
  }

  getLastKnownOdometer(): Odometer {
    return this.lastKnownOdometer;
  }

  getProjectedReplacementOdometer(): number {
    return this.projectedReplacementOdometer;
  }

  getProjectedReplacementDate(): Date | undefined {
    return this.projectedReplacementDate;
  }

  isMaintenanceDueStatus(): boolean {
    return this.isMaintenanceDue;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  updateWear(
    wearPercentage: WearPercentage,
    lastKnownOdometer: Odometer,
    projectedReplacementOdometer: number,
    isMaintenanceDue: boolean,
    projectedReplacementDate?: Date,
  ): void {
    this.currentWearPercentage = wearPercentage;
    this.lastKnownOdometer = lastKnownOdometer;
    this.projectedReplacementOdometer = projectedReplacementOdometer;
    this.isMaintenanceDue = isMaintenanceDue;
    this.projectedReplacementDate = projectedReplacementDate;
    this.lastCalculatedAt = new Date();
    this.updatedAt = new Date();
  }

  resetWear(): void {
    this.currentWearPercentage = WearPercentage.zero();
    this.isMaintenanceDue = false;
    this.lastCalculatedAt = new Date();
    this.updatedAt = new Date();
  }

  equals(other: PartWear): boolean {
    return this.id.equals(other.getId());
  }
}
