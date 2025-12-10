import { IdVO } from '../../../shared/infrastructure/domain/value-objects/id-vo';
import { ServiceType } from '../enums/service-type.enum';
import { ServiceInterval } from '../value-objects/service-interval.vo';
import { InvalidArgumentException } from '../../../shared/domain/exceptions/invalid-argument.exception';

export interface CreateMaintenanceRecordDto {
  userMotocycleId: string;
  serviceType: ServiceType | string;
  performedAt: Date;
  odometerAtService: number;
  cost?: number;
  partsUsed?: string;
  notes?: string;
  nextServiceInterval?: { intervalKm?: number; intervalMonths?: number };
}

export class MaintenanceRecord {
  private readonly id: IdVO;
  private readonly userMotocycleId: IdVO;
  private readonly serviceType: ServiceType | string;
  private performedAt: Date;
  private odometerAtService: number;
  private cost?: number;
  private partsUsed?: string;
  private notes?: string;
  private nextServiceInterval?: ServiceInterval;
  private readonly createdAt: Date;
  private updatedAt: Date;

  constructor(
    id: IdVO,
    userMotocycleId: IdVO,
    serviceType: ServiceType | string,
    performedAt: Date,
    odometerAtService: number,
    cost?: number,
    partsUsed?: string,
    notes?: string,
    nextServiceInterval?: ServiceInterval,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.validateOdometer(odometerAtService);
    this.validateCost(cost);

    this.id = id;
    this.userMotocycleId = userMotocycleId;
    this.serviceType = serviceType;
    this.performedAt = performedAt;
    this.odometerAtService = odometerAtService;
    this.cost = cost;
    this.partsUsed = partsUsed;
    this.notes = notes;
    this.nextServiceInterval = nextServiceInterval;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  static create(dto: CreateMaintenanceRecordDto): MaintenanceRecord {
    const id = new IdVO();
    const userMotocycleId = new IdVO(dto.userMotocycleId);

    const nextServiceInterval = dto.nextServiceInterval
      ? new ServiceInterval(dto.nextServiceInterval)
      : undefined;

    return new MaintenanceRecord(
      id,
      userMotocycleId,
      dto.serviceType,
      dto.performedAt,
      dto.odometerAtService,
      dto.cost,
      dto.partsUsed,
      dto.notes,
      nextServiceInterval,
    );
  }

  static reconstitute(
    id: string,
    userMotocycleId: string,
    serviceType: ServiceType | string,
    performedAt: Date,
    odometerAtService: number,
    cost?: number,
    partsUsed?: string,
    notes?: string,
    nextServiceInterval?: ServiceInterval,
    createdAt?: Date,
    updatedAt?: Date,
  ): MaintenanceRecord {
    return new MaintenanceRecord(
      new IdVO(id),
      new IdVO(userMotocycleId),
      serviceType,
      performedAt,
      odometerAtService,
      cost,
      partsUsed,
      notes,
      nextServiceInterval,
      createdAt,
      updatedAt,
    );
  }

  getId(): IdVO {
    return this.id;
  }

  getUserMotocycleId(): IdVO {
    return this.userMotocycleId;
  }

  getServiceType(): ServiceType | string {
    return this.serviceType;
  }

  getPerformedAt(): Date {
    return this.performedAt;
  }

  getOdometerAtService(): number {
    return this.odometerAtService;
  }

  getCost(): number | undefined {
    return this.cost;
  }

  getPartsUsed(): string | undefined {
    return this.partsUsed;
  }

  getNotes(): string | undefined {
    return this.notes;
  }

  getNextServiceInterval(): ServiceInterval | undefined {
    return this.nextServiceInterval;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  updateCost(cost: number | undefined): void {
    this.validateCost(cost);
    this.cost = cost;
    this.updatedAt = new Date();
  }

  updateNotes(notes: string | undefined): void {
    this.notes = notes;
    this.updatedAt = new Date();
  }

  updatePartsUsed(partsUsed: string | undefined): void {
    this.partsUsed = partsUsed;
    this.updatedAt = new Date();
  }

  updateNextServiceInterval(
    nextServiceInterval: ServiceInterval | undefined,
  ): void {
    this.nextServiceInterval = nextServiceInterval;
    this.updatedAt = new Date();
  }

  calculateNextServiceDueOdometer(): number | undefined {
    if (!this.nextServiceInterval) {
      return undefined;
    }
    return this.nextServiceInterval.calculateNextServiceDueOdometer(
      this.odometerAtService,
    );
  }

  calculateNextServiceDueDate(): Date | undefined {
    if (!this.nextServiceInterval) {
      return undefined;
    }
    return this.nextServiceInterval.calculateNextServiceDueDate();
  }

  private validateOdometer(odometer: number): void {
    if (odometer < 0) {
      throw new InvalidArgumentException(
        'odometerAtService',
        'Odometer cannot be negative',
      );
    }
    if (!Number.isInteger(odometer)) {
      throw new InvalidArgumentException(
        'odometerAtService',
        'Odometer must be an integer',
      );
    }
  }

  private validateCost(cost: number | undefined): void {
    if (cost !== undefined && cost < 0) {
      throw new InvalidArgumentException(
        'cost',
        'Cost cannot be negative',
      );
    }
  }
}
