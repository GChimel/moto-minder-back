import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Ride } from '../../domain/entities/ride.entity';
import { RIDE_REPOSITORY, RideRepositoryPort } from '../ports/ride.repository.port';
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
  ) {}

  async execute(id: string, dto: CompleteRideDto): Promise<Ride> {
    // Validate that id is provided
    if (!id || id.trim() === '') {
      throw new InvalidArgumentException('id', 'Ride ID is required');
    }

    // Find the existing ride
    const ride = await this.repository.findById(id);
    if (!ride) {
      throw new RideNotFoundException(id);
    }

    // Complete the ride
    ride.completeRide(dto.endOdometer, dto.fuelConsumed);

    // Persist updated ride
    return this.repository.save(ride);
  }
}
