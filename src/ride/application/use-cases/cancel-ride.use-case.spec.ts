import { CancelRideUseCase } from './cancel-ride.use-case';
import { Ride } from '../../domain/entities/ride.entity';
import { RideStatus } from '../../domain/enums/ride-status.enum';
import { IdVO } from '../../../shared/infrastructure/domain/value-objects/id-vo';
import { RideNotFoundException } from '../../domain/exceptions/ride-exceptions';
import { RideRepositoryPort } from '../ports/ride.repository.port';

describe('CancelRideUseCase', () => {
  let useCase: CancelRideUseCase;
  let mockRideRepository: jest.Mocked<RideRepositoryPort>;

  beforeEach(() => {
    mockRideRepository = {
      findById: jest.fn(),
      save: jest.fn(),
    } as unknown as jest.Mocked<RideRepositoryPort>;

    useCase = new CancelRideUseCase(mockRideRepository);
  });

  describe('execute', () => {
    it('should cancel an active ride', async () => {
      const rideId = new IdVO().getValue();
      const userMotocycleId = new IdVO().getValue();
      const ride = Ride.reconstitute(
        rideId,
        userMotocycleId,
        new Date('2024-01-01'),
        10000,
        undefined,
        undefined,
        undefined,
        undefined,
        RideStatus.ACTIVE,
        new Date(),
        new Date(),
      );

      mockRideRepository.findById.mockResolvedValue(ride);
      mockRideRepository.save.mockResolvedValue(ride);

      const result = await useCase.execute(rideId);

      expect(result.getStatus()).toBe(RideStatus.CANCELLED);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockRideRepository.save).toHaveBeenCalled();
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

    it('should throw error when trying to cancel a completed ride', async () => {
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

      await expect(useCase.execute(rideId)).rejects.toThrow();
    });
  });
});
