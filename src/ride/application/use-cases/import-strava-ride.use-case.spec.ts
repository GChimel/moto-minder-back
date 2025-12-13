import {
  ImportStravaRideUseCase,
  ImportStravaRideInput,
} from './import-strava-ride.use-case';
import { RideRepositoryPort } from '../ports/ride.repository.port';
import { Ride } from '../../domain/entities/ride.entity';
import { RideStatus } from '../../domain/enums/ride-status.enum';
import { BadRequestException } from '@nestjs/common';
import { IdVO } from '../../../shared/infrastructure/domain/value-objects/id-vo';

jest.mock('axios');

describe('ImportStravaRideUseCase', () => {
  let useCase: ImportStravaRideUseCase;
  let mockRideRepository: jest.Mocked<RideRepositoryPort>;

  beforeEach(() => {
    mockRideRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByUserMotorcycleId: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<RideRepositoryPort>;

    useCase = new ImportStravaRideUseCase(mockRideRepository);
  });

  describe('execute', () => {
    it('should import a Strava ride successfully', async () => {
      const input: ImportStravaRideInput = {
        accessToken: 'strava-access-token',
        stravaActivityId: 123456789,
        userMotocycleId: new IdVO().getValue(),
        startOdometer: 10000,
        endOdometer: 15000,
      };

      const mockActivity = {
        id: 123456789,
        name: 'Morning Ride',
        distance: 5000,
        moving_time: 1200,
        elapsed_time: 1500,
        start_date: '2024-01-15T08:00:00Z',
        start_date_local: '2024-01-15T08:00:00',
        timezone: 'America/Los_Angeles',
        utc_offset: -28800,
        kilojoules: 100,
        type: 'Ride',
        sport_type: 'Ride',
        device_watts: false,
        average_watts: 150,
        max_watts: 300,
        average_speed: 15,
        max_speed: 25,
        average_temp: 20,
        max_temp: 25,
        elev_high: 100,
        elev_low: 0,
        total_elevation_gain: 50,
        calories: 500,
        description: 'Great morning ride!',
      };

      jest
        .spyOn(useCase as any, 'fetchStravaActivity')
        .mockResolvedValue(mockActivity);

      const mockSavedRide = Ride.reconstitute(
        new IdVO().getValue(),
        input.userMotocycleId,
        new Date(mockActivity.start_date),
        input.startOdometer,
        new Date(
          new Date(mockActivity.start_date).getTime() +
            mockActivity.elapsed_time * 1000,
        ),
        input.endOdometer,
        undefined,
        `Strava: ${mockActivity.name} - ${mockActivity.description}`,
        RideStatus.COMPLETED,
        new Date(),
        new Date(),
      );

      mockRideRepository.save.mockResolvedValue(mockSavedRide);

      const result = await useCase.execute(input);

      expect(result).toBeDefined();
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockRideRepository.save).toHaveBeenCalled();
    });

    it('should throw BadRequestException if fetch fails', async () => {
      const input: ImportStravaRideInput = {
        accessToken: 'invalid-token',
        stravaActivityId: 999999999,
        userMotocycleId: new IdVO().getValue(),
        startOdometer: 10000,
        endOdometer: 15000,
      };

      jest
        .spyOn(useCase as any, 'fetchStravaActivity')
        .mockRejectedValue(new Error('API Error'));

      await expect(useCase.execute(input)).rejects.toThrow(BadRequestException);
    });

    it('should include activity name and description in ride notes', async () => {
      const input: ImportStravaRideInput = {
        accessToken: 'strava-access-token',
        stravaActivityId: 123456789,
        userMotocycleId: new IdVO().getValue(),
        startOdometer: 10000,
        endOdometer: 15000,
      };

      const mockActivity = {
        id: 123456789,
        name: 'Evening Ride',
        distance: 8000,
        moving_time: 2000,
        elapsed_time: 2400,
        start_date: '2024-01-15T18:00:00Z',
        start_date_local: '2024-01-15T18:00:00',
        timezone: 'America/Los_Angeles',
        utc_offset: -28800,
        kilojoules: 200,
        type: 'Ride',
        sport_type: 'Ride',
        device_watts: true,
        average_watts: 200,
        max_watts: 400,
        average_speed: 14,
        max_speed: 28,
        average_temp: 18,
        max_temp: 22,
        elev_high: 150,
        elev_low: 0,
        total_elevation_gain: 100,
        calories: 800,
        description: 'Scenic evening ride',
      };

      jest
        .spyOn(useCase as any, 'fetchStravaActivity')
        .mockResolvedValue(mockActivity);

      const mockSavedRide = Ride.reconstitute(
        new IdVO().getValue(),
        input.userMotocycleId,
        new Date(mockActivity.start_date),
        input.startOdometer,
        new Date(
          new Date(mockActivity.start_date).getTime() +
            mockActivity.elapsed_time * 1000,
        ),
        input.endOdometer,
        undefined,
        `Strava: ${mockActivity.name} - ${mockActivity.description}`,
        RideStatus.COMPLETED,
        new Date(),
        new Date(),
      );

      mockRideRepository.save.mockResolvedValue(mockSavedRide);

      const result = await useCase.execute(input);

      expect(result.getNotes()).toContain('Evening Ride');
      expect(result.getNotes()).toContain('Scenic evening ride');
    });

    it('should handle activities without description', async () => {
      const input: ImportStravaRideInput = {
        accessToken: 'strava-access-token',
        stravaActivityId: 123456789,
        userMotocycleId: new IdVO().getValue(),
        startOdometer: 10000,
        endOdometer: 15000,
      };

      const mockActivity = {
        id: 123456789,
        name: 'Quick Ride',
        distance: 3000,
        moving_time: 600,
        elapsed_time: 800,
        start_date: '2024-01-15T12:00:00Z',
        start_date_local: '2024-01-15T12:00:00',
        timezone: 'America/Los_Angeles',
        utc_offset: -28800,
        kilojoules: 50,
        type: 'Ride',
        sport_type: 'Ride',
        device_watts: false,
        average_watts: 100,
        max_watts: 200,
        average_speed: 15,
        max_speed: 20,
        average_temp: 22,
        max_temp: 25,
        elev_high: 50,
        elev_low: 0,
        total_elevation_gain: 30,
        calories: 200,
        description: '',
      };

      jest
        .spyOn(useCase as any, 'fetchStravaActivity')
        .mockResolvedValue(mockActivity);

      const mockSavedRide = Ride.reconstitute(
        new IdVO().getValue(),
        input.userMotocycleId,
        new Date(mockActivity.start_date),
        input.startOdometer,
        new Date(
          new Date(mockActivity.start_date).getTime() +
            mockActivity.elapsed_time * 1000,
        ),
        input.endOdometer,
        undefined,
        `Strava: ${mockActivity.name}`,
        RideStatus.COMPLETED,
        new Date(),
        new Date(),
      );

      mockRideRepository.save.mockResolvedValue(mockSavedRide);

      const result = await useCase.execute(input);

      expect(result.getNotes()).toContain('Quick Ride');
    });
  });
});
