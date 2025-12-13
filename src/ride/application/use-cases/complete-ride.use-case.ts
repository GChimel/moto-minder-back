import { Injectable, Logger } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Ride } from '../../domain/entities/ride.entity';
import {
  RIDE_REPOSITORY,
  RideRepositoryPort,
} from '../ports/ride.repository.port';
import { RideNotFoundException } from '../../domain/exceptions/ride-exceptions';
import { InvalidArgumentException } from '../../../shared/domain/exceptions/invalid-argument.exception';

export interface CompleteRideDto {
  endOdometer: number;
  fuelConsumed?: number;
}

@Injectable()
export class CompleteRideUseCase {
  private readonly logger = new Logger(CompleteRideUseCase.name);

  constructor(
    @Inject(RIDE_REPOSITORY)
    private readonly repository: RideRepositoryPort,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(id: string, dto: CompleteRideDto): Promise<Ride> {
    this.logger.log(
      `Completing ride: ${id}, endOdometer: ${dto.endOdometer}, fuel: ${dto.fuelConsumed}`,
    );

    if (!id || id.trim() === '') {
      this.logger.warn('Ride completion failed: Ride ID is required');
      throw new InvalidArgumentException('id', 'Ride ID is required');
    }

    const ride = await this.repository.findById(id);
    if (!ride) {
      this.logger.warn(`Ride completion failed: Ride not found - ${id}`);
      throw new RideNotFoundException(id);
    }

    ride.completeRide(dto.endOdometer, dto.fuelConsumed);

    const savedRide = await this.repository.save(ride);

    const events = savedRide.getDomainEvents();
    this.logger.log(`Ride completed: ${id}, events to emit: ${events.length}`);

    for (const event of events) {
      this.logger.debug(`Emitting event: ${event.getEventName()}`);
      this.eventEmitter.emit(event.getEventName(), event);
    }
    savedRide.clearDomainEvents();

    return savedRide;
  }
}
