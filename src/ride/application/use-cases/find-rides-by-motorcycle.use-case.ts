import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Ride } from '../../domain/entities/ride.entity';
import { RIDE_REPOSITORY, RideRepositoryPort } from '../ports/ride.repository.port';
import { InvalidArgumentException } from '../../../shared/domain/exceptions/invalid-argument.exception';

@Injectable()
export class FindRidesByMotorcycleUseCase {
  constructor(
    @Inject(RIDE_REPOSITORY)
    private readonly repository: RideRepositoryPort,
  ) {}

  async execute(userMotocycleId: string): Promise<Ride[]> {
    // Validate that userMotocycleId is provided
    if (!userMotocycleId || userMotocycleId.trim() === '') {
      throw new InvalidArgumentException(
        'userMotocycleId',
        'User motorcycle ID is required',
      );
    }

    // Find all rides for the motorcycle
    const rides = await this.repository.findByUserMotocycleId(userMotocycleId);

    // Sort by startDate in descending order (newest first)
    return rides.sort(
      (a, b) =>
        new Date(b.getStartDate()).getTime() -
        new Date(a.getStartDate()).getTime(),
    );
  }
}
