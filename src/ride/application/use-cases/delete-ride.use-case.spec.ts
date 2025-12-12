import { DeleteRideUseCase } from './delete-ride.use-case';
import { Ride } from '../../domain/entities/ride.entity';
import { RideStatus } from '../../domain/enums/ride-status.enum';
import { IdVO } from '../../../shared/infrastructure/domain/value-objects/id-vo';
import { RideNotFoundException } from '../../domain/exceptions/ride-exceptions';

describe('DeleteRideUseCase', () => {
  let useCase: DeleteRideUseCase;
  let mockRideRepository: any;

  beforeEach(() => {
    mockRideRepository = {
      findById: jest.fn(),
      delete: jest.fn(),
    } as unknown as any;

    useCase = new DeleteRideUseCase(mockRideRepository);
  });

  describe('execute', () => {
    it('should delete an existing ride', async () => {
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
        undefined,
        RideStatus.COMPLETED,
        new Date(),
        new Date(),
      );

      mockRideRepository.findById.mockResolvedValue(ride);
      mockRideRepository.delete.mockResolvedValue(undefined);

      await useCase.execute(rideId);

      expect(mockRideRepository.delete).toHaveBeenCalledWith(rideId);
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
