import { Injectable, Logger } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Ride } from '../../domain/entities/ride.entity';
import {
  RIDE_REPOSITORY,
  RideRepositoryPort,
} from '../ports/ride.repository.port';
import { CreateRideDto } from '../../domain/entities/ride.entity';
import { InvalidArgumentException } from '../../../shared/domain/exceptions/invalid-argument.exception';

@Injectable()
export class StartRideUseCase {
  private readonly logger = new Logger(StartRideUseCase.name);

  constructor(
    @Inject(RIDE_REPOSITORY)
    private readonly repository: RideRepositoryPort,
  ) {}

  async execute(dto: CreateRideDto): Promise<Ride> {
    this.logger.log(
      `Starting ride for motorcycle: ${dto.userMotocycleId}, odometer: ${dto.startOdometer}`,
    );

    if (!dto.userMotocycleId || dto.userMotocycleId.trim() === '') {
      this.logger.warn('Ride start failed: userMotocycleId is required');
      throw new InvalidArgumentException(
        'userMotocycleId',
        'User motorcycle ID is required',
      );
    }

    if (dto.startOdometer < 0) {
      this.logger.warn(
        `Ride start failed: Invalid odometer reading: ${dto.startOdometer}`,
      );
      throw new InvalidArgumentException(
        'startOdometer',
        'Start odometer cannot be negative',
      );
    }

    const ride = Ride.create(dto);
    const savedRide = await this.repository.save(ride);

    this.logger.log(
      `Ride started successfully: ${savedRide.getId().getValue()}`,
    );

    return savedRide;
  }
}
