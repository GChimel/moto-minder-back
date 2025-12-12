import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Ride } from '../../domain/entities/ride.entity';
import {
  RIDE_REPOSITORY,
  RideRepositoryPort,
} from '../ports/ride.repository.port';
import { RideNotFoundException } from '../../domain/exceptions/ride-exceptions';
import { InvalidArgumentException } from '../../../shared/domain/exceptions/invalid-argument.exception';

@Injectable()
export class UpdateRideNotesUseCase {
  constructor(
    @Inject(RIDE_REPOSITORY)
    private readonly repository: RideRepositoryPort,
  ) {}

  async execute(id: string, notes: string | undefined): Promise<Ride> {
    if (!id || id.trim() === '') {
      throw new InvalidArgumentException('id', 'Ride ID is required');
    }

    const ride = await this.repository.findById(id);
    if (!ride) {
      throw new RideNotFoundException(id);
    }

    ride.updateNotes(notes);

    return this.repository.save(ride);
  }
}
