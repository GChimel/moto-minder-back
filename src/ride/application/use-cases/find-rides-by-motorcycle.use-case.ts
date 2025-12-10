import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Ride } from '../../domain/entities/ride.entity';
import {
  RIDE_REPOSITORY,
  RideRepositoryPort,
} from '../ports/ride.repository.port';
import { InvalidArgumentException } from '../../../shared/domain/exceptions/invalid-argument.exception';

@Injectable()
export class FindRidesByMotorcycleUseCase {
  constructor(
    @Inject(RIDE_REPOSITORY)
    private readonly repository: RideRepositoryPort,
  ) {}

  async execute(userMotocycleId: string): Promise<Ride[]> {

    if (!userMotocycleId || userMotocycleId.trim() === '') {
      throw new InvalidArgumentException(
        'userMotocycleId',
        'User motorcycle ID is required',
      );
    }

    const rides = await this.repository.findByUserMotocycleId(userMotocycleId);

    return rides.sort(
      (a, b) =>
        new Date(b.getStartDate()).getTime() -
        new Date(a.getStartDate()).getTime(),
    );
  }
}
