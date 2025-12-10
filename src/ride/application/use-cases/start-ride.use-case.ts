import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Ride } from '../../domain/entities/ride.entity';
import { RIDE_REPOSITORY, RideRepositoryPort } from '../ports/ride.repository.port';
import { CreateRideDto } from '../../domain/entities/ride.entity';
import { InvalidArgumentException } from '../../../shared/domain/exceptions/invalid-argument.exception';

@Injectable()
export class StartRideUseCase {
  constructor(
    @Inject(RIDE_REPOSITORY)
    private readonly repository: RideRepositoryPort,
  ) {}

  async execute(dto: CreateRideDto): Promise<Ride> {
    // Validate that userMotocycleId is provided
    if (!dto.userMotocycleId || dto.userMotocycleId.trim() === '') {
      throw new InvalidArgumentException(
        'userMotocycleId',
        'User motorcycle ID is required',
      );
    }

    // Validate that startOdometer is non-negative
    if (dto.startOdometer < 0) {
      throw new InvalidArgumentException(
        'startOdometer',
        'Start odometer cannot be negative',
      );
    }

    // Create the ride entity
    const ride = Ride.create(dto);

    // Persist to repository
    return this.repository.save(ride);
  }
}
