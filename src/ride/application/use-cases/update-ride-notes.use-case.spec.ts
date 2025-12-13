import { UpdateRideNotesUseCase } from './update-ride-notes.use-case';
import { Ride } from '../../domain/entities/ride.entity';
import { RideStatus } from '../../domain/enums/ride-status.enum';
import { IdVO } from '../../../shared/infrastructure/domain/value-objects/id-vo';
import { RideNotFoundException } from '../../domain/exceptions/ride-exceptions';
import { RideRepositoryPort } from '../ports/ride.repository.port';

describe('UpdateRideNotesUseCase', () => {
  let useCase: UpdateRideNotesUseCase;
  let mockRideRepository: jest.Mocked<RideRepositoryPort>;

  beforeEach(() => {
    mockRideRepository = {
      findById: jest.fn(),
      save: jest.fn(),
    } as unknown as jest.Mocked<RideRepositoryPort>;

    useCase = new UpdateRideNotesUseCase(mockRideRepository);
  });

  describe('execute', () => {
    it('should update ride notes', async () => {
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
        'Original notes',
        RideStatus.COMPLETED,
        new Date(),
        new Date(),
      );

      mockRideRepository.findById.mockResolvedValue(ride);
      mockRideRepository.save.mockResolvedValue(ride);

      const newNotes = 'Updated notes';
      const result = await useCase.execute(rideId, newNotes);

      expect(result.getNotes()).toBe(newNotes);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockRideRepository.save).toHaveBeenCalled();
    });

    it('should clear ride notes when passing undefined', async () => {
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
        'Original notes',
        RideStatus.COMPLETED,
        new Date(),
        new Date(),
      );

      mockRideRepository.findById.mockResolvedValue(ride);
      mockRideRepository.save.mockResolvedValue(ride);

      const result = await useCase.execute(rideId, undefined);

      expect(result.getNotes()).toBeUndefined();
    });

    it('should throw RideNotFoundException when ride does not exist', async () => {
      const rideId = new IdVO().getValue();

      mockRideRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute(rideId, 'New notes')).rejects.toThrow(
        RideNotFoundException,
      );
    });

    it('should throw error for empty ride ID', async () => {
      await expect(useCase.execute('', 'New notes')).rejects.toThrow();
    });
  });
});
