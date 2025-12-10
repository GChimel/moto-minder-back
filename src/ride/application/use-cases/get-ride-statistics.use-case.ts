import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Ride } from '../../domain/entities/ride.entity';
import { RIDE_REPOSITORY, RideRepositoryPort } from '../ports/ride.repository.port';
import { RideStatus } from '../../domain/enums/ride-status.enum';
import { InvalidArgumentException } from '../../../shared/domain/exceptions/invalid-argument.exception';

export interface RideStatisticsDto {
  userMotocycleId: string;
  totalRides: number;
  completedRides: number;
  activeRides: number;
  cancelledRides: number;
  totalDistance: number;
  totalFuelConsumed?: number;
  averageFuelEconomy?: number;
  averageSpeed?: number;
  longestRideDistance?: number;
  totalDuration: number; // in minutes
}

@Injectable()
export class GetRideStatisticsUseCase {
  constructor(
    @Inject(RIDE_REPOSITORY)
    private readonly repository: RideRepositoryPort,
  ) {}

  async execute(userMotocycleId: string): Promise<RideStatisticsDto> {
    // Validate that userMotocycleId is provided
    if (!userMotocycleId || userMotocycleId.trim() === '') {
      throw new InvalidArgumentException(
        'userMotocycleId',
        'User motorcycle ID is required',
      );
    }

    // Get all rides for the motorcycle
    const rides = await this.repository.findByUserMotocycleId(userMotocycleId);

    // Calculate statistics
    let totalDistance = 0;
    let totalFuelConsumed = 0;
    let totalDuration = 0;
    let fuelEconomySum = 0;
    let speedSum = 0;
    let fuelEconomyCount = 0;
    let speedCount = 0;
    let longestRideDistance = 0;

    const completedRides = rides.filter(
      (r) => r.getStatus() === RideStatus.COMPLETED,
    );
    const activeRides = rides.filter((r) => r.getStatus() === RideStatus.ACTIVE);
    const cancelledRides = rides.filter(
      (r) => r.getStatus() === RideStatus.CANCELLED,
    );

    for (const ride of completedRides) {
      const distance = ride.calculateDistance();
      if (distance) {
        totalDistance += distance.getKilometers();
        longestRideDistance = Math.max(
          longestRideDistance,
          distance.getKilometers(),
        );
      }

      const fuelConsumed = ride.getFuelConsumed();
      if (fuelConsumed) {
        totalFuelConsumed += fuelConsumed.getLiters();
      }

      const duration = ride.calculateDuration();
      if (duration) {
        totalDuration += duration;
      }

      const fuelEconomy = ride.calculateFuelEconomy();
      if (fuelEconomy !== undefined) {
        fuelEconomySum += fuelEconomy;
        fuelEconomyCount++;
      }

      const speed = ride.calculateAverageSpeed();
      if (speed !== undefined) {
        speedSum += speed;
        speedCount++;
      }
    }

    return {
      userMotocycleId,
      totalRides: rides.length,
      completedRides: completedRides.length,
      activeRides: activeRides.length,
      cancelledRides: cancelledRides.length,
      totalDistance,
      totalFuelConsumed: completedRides.length > 0 ? totalFuelConsumed : undefined,
      averageFuelEconomy:
        fuelEconomyCount > 0 ? fuelEconomySum / fuelEconomyCount : undefined,
      averageSpeed: speedCount > 0 ? speedSum / speedCount : undefined,
      longestRideDistance: completedRides.length > 0 ? longestRideDistance : undefined,
      totalDuration,
    };
  }
}
