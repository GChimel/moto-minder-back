import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import axios from 'axios';
import { Ride } from '../../domain/entities/ride.entity';
import {
  RideRepositoryPort,
  RIDE_REPOSITORY,
} from '../ports/ride.repository.port';
import {
  InvalidRideStateException,
  InvalidOdometerRangeException,
} from '../../domain/exceptions/ride-exceptions';

interface StravaActivity {
  id: number;
  name: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  start_date: string;
  start_date_local: string;
  timezone: string;
  utc_offset: number;
  kilojoules: number;
  type: string;
  sport_type: string;
  device_watts: boolean;
  average_watts: number;
  max_watts: number;
  average_speed: number;
  max_speed: number;
  average_temp: number;
  max_temp: number;
  elev_high: number;
  elev_low: number;
  total_elevation_gain: number;
  calories: number;
  description: string;
}

export interface ImportStravaRideInput {
  accessToken: string;
  stravaActivityId: number;
  userMotocycleId: string;
  startOdometer: number;
  endOdometer: number;
}

@Injectable()
export class ImportStravaRideUseCase {
  private readonly stravaApiUrl = 'https://www.strava.com/api/v3';

  constructor(
    @Inject(RIDE_REPOSITORY)
    private readonly rideRepository: RideRepositoryPort,
  ) {}

  async execute(input: ImportStravaRideInput): Promise<Ride> {
    try {
      const activity = await this.fetchStravaActivity(
        input.accessToken,
        input.stravaActivityId,
      );

      const ride = this.createRideFromActivity(
        activity,
        input.userMotocycleId,
        input.startOdometer,
        input.endOdometer,
      );

      const savedRide = await this.rideRepository.save(ride);

      return savedRide;
    } catch (error) {
      if (
        error instanceof InvalidRideStateException ||
        error instanceof InvalidOdometerRangeException
      ) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to import Strava ride: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  private async fetchStravaActivity(
    accessToken: string,
    activityId: number,
  ): Promise<StravaActivity> {
    const response = await axios.get<StravaActivity>(
      `${this.stravaApiUrl}/activities/${activityId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return response.data;
  }

  private createRideFromActivity(
    activity: StravaActivity,
    userMotocycleId: string,
    startOdometer: number,
    endOdometer: number,
  ): Ride {
    const startDate = new Date(activity.start_date);
    const endDate = new Date(
      new Date(activity.start_date).getTime() + activity.elapsed_time * 1000,
    );

    const notes = activity.description
      ? `Strava: ${activity.name} - ${activity.description}`
      : `Strava: ${activity.name}`;

    const ride = Ride.create({
      userMotocycleId,
      startDate,
      endDate,
      startOdometer,
      endOdometer,
      notes,
    });

    return ride;
  }
}
