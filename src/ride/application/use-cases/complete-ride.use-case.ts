import { Injectable } from '@nestjs/common';
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
  constructor(
    @Inject(RIDE_REPOSITORY)
    private readonly repository: RideRepositoryPort,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(id: string, dto: CompleteRideDto): Promise<Ride> {
    if (!id || id.trim() === '') {
      throw new InvalidArgumentException('id', 'Ride ID is required');
    }

    const ride = await this.repository.findById(id);
    if (!ride) {
      throw new RideNotFoundException(id);
    }

    ride.completeRide(dto.endOdometer, dto.fuelConsumed);

    const savedRide = await this.repository.save(ride);

    const events = savedRide.getDomainEvents();
    for (const event of events) {
      this.eventEmitter.emit(event.getEventName(), event);
    }
    savedRide.clearDomainEvents();

    return savedRide;
  }
}
