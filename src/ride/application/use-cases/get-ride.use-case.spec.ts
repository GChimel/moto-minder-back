import { GetRideUseCase } from './get-ride.use-case';
import { Ride } from '../../domain/entities/ride.entity';
import { RideStatus } from '../../domain/enums/ride-status.enum';
import { IdVO } from '../../../shared/infrastructure/domain/value-objects/id-vo';
import { RideNotFoundException } from '../../domain/exceptions/ride-exceptions';

describe('GetRideUseCase', () => {
  let useCase: GetRideUseCase;
  let mockRideRepository: any;

  beforeEach(() => {
    mockRideRepository = {
      findById: jest.fn(),
    } as unknown as any;

    useCase = new GetRideUseCase(mockRideRepository);
  });

  describe('execute', () => {
    it('should return a ride when it exists', async () => {
      const rideId = new IdVO().getValue();
      const userMotocycleId = new IdVO().getValue();
      const ride = Ride.reconstitute(
        rideId,
        userMotocycleId,
        new Date('2024-01-01'),
        10000,
        new Date('2024-01-01'),
        15000,
        undefined,
        'Test ride',
        RideStatus.COMPLETED,
        new Date(),
        new Date(),
      );

      mockRideRepository.findById.mockResolvedValue(ride);

      const result = await useCase.execute(rideId);

      expect(result).toEqual(ride);
      expect(mockRideRepository.findById).toHaveBeenCalledWith(rideId);
    });

    it('should throw RideNotFoundException when ride does not exist', async () => {
      const rideId = new IdVO().getValue();

      mockRideRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute(rideId)).rejects.toThrow(
        RideNotFoundException,
      );
    });

    it('should throw error for empty ride ID', async () => {
      await expect(useCase.execute('')).rejects.toThrow();
    });
  });
});
