import { IdVO } from '../../../shared/infrastructure/domain/value-objects/id-vo';
import { RideStatus } from '../enums/ride-status.enum';
import { Distance } from '../value-objects/distance.vo';
import { FuelConsumed } from '../value-objects/fuel-consumed.vo';
import { InvalidArgumentException } from '../../../shared/domain/exceptions/invalid-argument.exception';
import {
  InvalidRideStateException,
  InvalidOdometerRangeException,
} from '../exceptions/ride-exceptions';
import { DomainEvent } from '../../../shared/domain/events/domain-event';
import { RideCompletedEvent } from '../events/ride-completed.event';

export interface CreateRideDto {
  userMotocycleId: string;
  startDate: Date;
  endDate?: Date;
  startOdometer: number;
  endOdometer?: number;
  fuelConsumed?: number;
  notes?: string;
}

export class Ride {
  private readonly id: IdVO;
  private readonly userMotocycleId: IdVO;
  private readonly startDate: Date;
  private endDate?: Date;
  private startOdometer: number;
  private endOdometer?: number;
  private fuelConsumed?: FuelConsumed;
  private notes?: string;
  private status: RideStatus;
  private readonly createdAt: Date;
  private updatedAt: Date;
  private domainEvents: DomainEvent[] = [];

  constructor(
    id: IdVO,
    userMotocycleId: IdVO,
    startDate: Date,
    startOdometer: number,
    endDate?: Date,
    endOdometer?: number,
    fuelConsumed?: FuelConsumed,
    notes?: string,
    status?: RideStatus,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.validateOdometer(startOdometer);
    if (endOdometer !== undefined) {
      this.validateOdometer(endOdometer);
      this.validateOdometerRange(startOdometer, endOdometer);
    }

    this.id = id;
    this.userMotocycleId = userMotocycleId;
    this.startDate = startDate;
    this.startOdometer = startOdometer;
    this.endDate = endDate;
    this.endOdometer = endOdometer;
    this.fuelConsumed = fuelConsumed;
    this.notes = notes;
    this.status = status || RideStatus.ACTIVE;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  static create(dto: CreateRideDto): Ride {
    const id = new IdVO();
    const userMotocycleId = new IdVO(dto.userMotocycleId);

    const fuelConsumed = dto.fuelConsumed
      ? new FuelConsumed(dto.fuelConsumed)
      : undefined;

    return new Ride(
      id,
      userMotocycleId,
      dto.startDate,
      dto.startOdometer,
      dto.endDate,
      dto.endOdometer,
      fuelConsumed,
      dto.notes,
    );
  }

  static reconstitute(
    id: string,
    userMotocycleId: string,
    startDate: Date,
    startOdometer: number,
    endDate?: Date,
    endOdometer?: number,
    fuelConsumed?: FuelConsumed,
    notes?: string,
    status?: RideStatus,
    createdAt?: Date,
    updatedAt?: Date,
  ): Ride {
    return new Ride(
      new IdVO(id),
      new IdVO(userMotocycleId),
      startDate,
      startOdometer,
      endDate,
      endOdometer,
      fuelConsumed,
      notes,
      status,
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

  getStartDate(): Date {
    return this.startDate;
  }

  getEndDate(): Date | undefined {
    return this.endDate;
  }

  getStartOdometer(): number {
    return this.startOdometer;
  }

  getEndOdometer(): number | undefined {
    return this.endOdometer;
  }

  getFuelConsumed(): FuelConsumed | undefined {
    return this.fuelConsumed;
  }

  getNotes(): string | undefined {
    return this.notes;
  }

  getStatus(): RideStatus {
    return this.status;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  completeRide(endOdometer: number, fuelConsumed?: number): void {
    if (this.status === RideStatus.COMPLETED) {
      throw new InvalidRideStateException('Ride is already completed');
    }

    if (this.status === RideStatus.CANCELLED) {
      throw new InvalidRideStateException('Cannot complete a cancelled ride');
    }

    this.validateOdometer(endOdometer);
    this.validateOdometerRange(this.startOdometer, endOdometer);

    this.endOdometer = endOdometer;
    this.endDate = new Date();
    this.status = RideStatus.COMPLETED;

    if (fuelConsumed !== undefined) {
      this.fuelConsumed = new FuelConsumed(fuelConsumed);
    }

    this.updatedAt = new Date();

    this.addDomainEvent(
      new RideCompletedEvent(
        this.id.getValue(),
        this.userMotocycleId.getValue(),
        endOdometer,
      ),
    );
  }

  cancelRide(): void {
    if (this.status === RideStatus.COMPLETED) {
      throw new InvalidRideStateException('Cannot cancel a completed ride');
    }

    this.status = RideStatus.CANCELLED;
    this.updatedAt = new Date();
  }

  updateNotes(notes: string | undefined): void {
    this.notes = notes;
    this.updatedAt = new Date();
  }

  calculateDistance(): Distance | undefined {
    if (!this.endOdometer) {
      return undefined;
    }
    return new Distance(this.endOdometer - this.startOdometer);
  }

  calculateFuelEconomy(): number | undefined {
    if (!this.fuelConsumed || !this.endOdometer) {
      return undefined;
    }
    const distance = this.endOdometer - this.startOdometer;
    return this.fuelConsumed.calculateFuelEconomy(distance);
  }

  calculateDuration(): number | undefined {
    if (!this.endDate) {
      return undefined;
    }

    return (this.endDate.getTime() - this.startDate.getTime()) / (1000 * 60);
  }

  calculateAverageSpeed(): number | undefined {
    const duration = this.calculateDuration();
    const distance = this.calculateDistance();

    if (!duration || !distance || duration === 0) {
      return undefined;
    }

    return distance.getKilometers() / (duration / 60);
  }

  private validateOdometer(odometer: number): void {
    if (odometer < 0) {
      throw new InvalidArgumentException(
        'odometer',
        'Odometer cannot be negative',
      );
    }
    if (!Number.isInteger(odometer)) {
      throw new InvalidArgumentException(
        'odometer',
        'Odometer must be an integer',
      );
    }
  }

  private validateOdometerRange(
    startOdometer: number,
    endOdometer: number,
  ): void {
    if (endOdometer < startOdometer) {
      throw new InvalidOdometerRangeException(
        'End odometer cannot be less than start odometer',
      );
    }
  }

  addDomainEvent(event: DomainEvent): void {
    this.domainEvents.push(event);
  }

  getDomainEvents(): DomainEvent[] {
    return this.domainEvents;
  }

  clearDomainEvents(): void {
    this.domainEvents = [];
  }
}
