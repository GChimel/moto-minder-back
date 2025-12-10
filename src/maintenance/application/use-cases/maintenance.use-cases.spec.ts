/* eslint-disable @typescript-eslint/unbound-method */
import { CreateMaintenanceRecordUseCase } from './create-maintenance-record.use-case';
import { FindMaintenanceByMotorcycleUseCase } from './find-maintenance-by-motorcycle.use-case';
import { FindUpcomingMaintenanceUseCase } from './find-upcoming-maintenance.use-case';
import { UpdateMaintenanceRecordUseCase } from './update-maintenance-record.use-case';
import { DeleteMaintenanceRecordUseCase } from './delete-maintenance-record.use-case';
import { GetMaintenanceHistoryUseCase } from './get-maintenance-history.use-case';
import { MaintenanceRecordRepositoryPort } from '../ports/maintenance-record.repository.port';
import { MaintenanceRecord } from '../../domain/entities/maintenance-record.entity';
import { ServiceType } from '../../domain/enums/service-type.enum';
import { InvalidArgumentException } from '../../../shared/domain/exceptions/invalid-argument.exception';
import { MaintenanceRecordNotFoundException } from '../../domain/exceptions/maintenance-exceptions';

describe('Maintenance Use Cases', () => {
  let mockRepository: jest.Mocked<MaintenanceRecordRepositoryPort>;
  let createUseCase: CreateMaintenanceRecordUseCase;
  let findByMotorcycleUseCase: FindMaintenanceByMotorcycleUseCase;
  let findUpcomingUseCase: FindUpcomingMaintenanceUseCase;
  let updateUseCase: UpdateMaintenanceRecordUseCase;
  let deleteUseCase: DeleteMaintenanceRecordUseCase;
  let getHistoryUseCase: GetMaintenanceHistoryUseCase;

  const validUserMotocycleId = '550e8400-e29b-41d4-a716-446655440001';
  const validDate = new Date('2024-01-15');

  beforeEach(() => {
    mockRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByUserMotocycleId: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<MaintenanceRecordRepositoryPort>;

    createUseCase = new CreateMaintenanceRecordUseCase(mockRepository);
    findByMotorcycleUseCase = new FindMaintenanceByMotorcycleUseCase(
      mockRepository,
    );
    findUpcomingUseCase = new FindUpcomingMaintenanceUseCase(mockRepository);
    updateUseCase = new UpdateMaintenanceRecordUseCase(mockRepository);
    deleteUseCase = new DeleteMaintenanceRecordUseCase(mockRepository);
    getHistoryUseCase = new GetMaintenanceHistoryUseCase(mockRepository);
  });

  describe('CreateMaintenanceRecordUseCase', () => {
    it('should create and persist a maintenance record', async () => {
      const dto = {
        userMotocycleId: validUserMotocycleId,
        serviceType: ServiceType.OIL_CHANGE,
        performedAt: validDate,
        odometerAtService: 10000,
      };

      const createdRecord = MaintenanceRecord.create(dto);
      mockRepository.save.mockResolvedValue(createdRecord);

      const result = await createUseCase.execute(dto);

      expect(mockRepository.save).toHaveBeenCalledTimes(1);
      expect(result.getServiceType()).toBe(ServiceType.OIL_CHANGE);
    });

    it('should throw if userMotocycleId is empty', async () => {
      const dto = {
        userMotocycleId: '',
        serviceType: ServiceType.OIL_CHANGE,
        performedAt: validDate,
        odometerAtService: 10000,
      };

      await expect(createUseCase.execute(dto)).rejects.toThrow(
        InvalidArgumentException,
      );
    });

    it('should throw if performedAt is in the future', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);

      const dto = {
        userMotocycleId: validUserMotocycleId,
        serviceType: ServiceType.OIL_CHANGE,
        performedAt: futureDate,
        odometerAtService: 10000,
      };

      await expect(createUseCase.execute(dto)).rejects.toThrow(
        InvalidArgumentException,
      );
    });

    it('should throw if odometer is negative', async () => {
      const dto = {
        userMotocycleId: validUserMotocycleId,
        serviceType: ServiceType.OIL_CHANGE,
        performedAt: validDate,
        odometerAtService: -1,
      };

      await expect(createUseCase.execute(dto)).rejects.toThrow(
        InvalidArgumentException,
      );
    });
  });

  describe('FindMaintenanceByMotorcycleUseCase', () => {
    it('should find maintenance records by motorcycle id', async () => {
      const record1 = MaintenanceRecord.create({
        userMotocycleId: validUserMotocycleId,
        serviceType: ServiceType.OIL_CHANGE,
        performedAt: new Date('2024-01-15'),
        odometerAtService: 10000,
      });

      const record2 = MaintenanceRecord.create({
        userMotocycleId: validUserMotocycleId,
        serviceType: ServiceType.TIRE_REPLACEMENT,
        performedAt: new Date('2024-02-15'),
        odometerAtService: 15000,
      });

      mockRepository.findByUserMotocycleId.mockResolvedValue([
        record1,
        record2,
      ]);

      const results =
        await findByMotorcycleUseCase.execute(validUserMotocycleId);

      expect(mockRepository.findByUserMotocycleId).toHaveBeenCalledWith(
        validUserMotocycleId,
      );
      expect(results).toHaveLength(2);

      expect(
        results[0].getPerformedAt().getTime() >=
          results[1].getPerformedAt().getTime(),
      ).toBe(true);
    });

    it('should return empty array if no records found', async () => {
      mockRepository.findByUserMotocycleId.mockResolvedValue([]);

      const results =
        await findByMotorcycleUseCase.execute(validUserMotocycleId);

      expect(results).toEqual([]);
    });

    it('should throw if userMotocycleId is empty', async () => {
      await expect(findByMotorcycleUseCase.execute('')).rejects.toThrow(
        InvalidArgumentException,
      );
    });
  });

  describe('FindUpcomingMaintenanceUseCase', () => {
    it('should find upcoming maintenance sorted by urgency', async () => {
      const record1 = MaintenanceRecord.create({
        userMotocycleId: validUserMotocycleId,
        serviceType: ServiceType.OIL_CHANGE,
        performedAt: validDate,
        odometerAtService: 10000,
        nextServiceInterval: { intervalKm: 5000 },
      });

      const record2 = MaintenanceRecord.create({
        userMotocycleId: validUserMotocycleId,
        serviceType: ServiceType.TIRE_REPLACEMENT,
        performedAt: validDate,
        odometerAtService: 15000,
        nextServiceInterval: { intervalKm: 10000 },
      });

      mockRepository.findByUserMotocycleId.mockResolvedValue([
        record1,
        record2,
      ]);

      const results = await findUpcomingUseCase.execute(
        validUserMotocycleId,
        18000,
      );

      expect(results).toHaveLength(2);

      expect(results[0].isOverdueByOdometer).toBe(true);
      expect(results[1].isOverdueByOdometer).toBe(false);
    });

    it('should filter records without next service interval', async () => {
      const record1 = MaintenanceRecord.create({
        userMotocycleId: validUserMotocycleId,
        serviceType: ServiceType.OIL_CHANGE,
        performedAt: validDate,
        odometerAtService: 10000,
      });

      const record2 = MaintenanceRecord.create({
        userMotocycleId: validUserMotocycleId,
        serviceType: ServiceType.TIRE_REPLACEMENT,
        performedAt: validDate,
        odometerAtService: 15000,
        nextServiceInterval: { intervalKm: 10000 },
      });

      mockRepository.findByUserMotocycleId.mockResolvedValue([
        record1,
        record2,
      ]);

      const results = await findUpcomingUseCase.execute(
        validUserMotocycleId,
        20000,
      );

      expect(results).toHaveLength(1);
    });

    it('should throw if currentOdometer is negative', async () => {
      await expect(
        findUpcomingUseCase.execute(validUserMotocycleId, -1),
      ).rejects.toThrow(InvalidArgumentException);
    });
  });

  describe('UpdateMaintenanceRecordUseCase', () => {
    it('should update a maintenance record', async () => {
      const record = MaintenanceRecord.create({
        userMotocycleId: validUserMotocycleId,
        serviceType: ServiceType.OIL_CHANGE,
        performedAt: validDate,
        odometerAtService: 10000,
        cost: 50,
      });

      mockRepository.findById.mockResolvedValue(record);
      mockRepository.save.mockResolvedValue(record);

      await updateUseCase.execute('record-id', { cost: 75 });

      expect(mockRepository.findById).toHaveBeenCalledWith('record-id');
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should throw if record not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(
        updateUseCase.execute('non-existent-id', { cost: 75 }),
      ).rejects.toThrow(MaintenanceRecordNotFoundException);
    });

    it('should throw if id is empty', async () => {
      await expect(updateUseCase.execute('', { cost: 75 })).rejects.toThrow(
        InvalidArgumentException,
      );
    });

    it('should update multiple fields at once', async () => {
      const record = MaintenanceRecord.create({
        userMotocycleId: validUserMotocycleId,
        serviceType: ServiceType.OIL_CHANGE,
        performedAt: validDate,
        odometerAtService: 10000,
      });

      mockRepository.findById.mockResolvedValue(record);
      mockRepository.save.mockResolvedValue(record);

      await updateUseCase.execute('record-id', {
        cost: 100,
        notes: 'Updated notes',
        partsUsed: 'New parts',
      });

      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe('DeleteMaintenanceRecordUseCase', () => {
    it('should delete a maintenance record', async () => {
      const record = MaintenanceRecord.create({
        userMotocycleId: validUserMotocycleId,
        serviceType: ServiceType.OIL_CHANGE,
        performedAt: validDate,
        odometerAtService: 10000,
      });

      mockRepository.findById.mockResolvedValue(record);
      mockRepository.delete.mockResolvedValue(undefined);

      await deleteUseCase.execute('record-id');

      expect(mockRepository.findById).toHaveBeenCalledWith('record-id');
      expect(mockRepository.delete).toHaveBeenCalledWith('record-id');
    });

    it('should throw if record not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(deleteUseCase.execute('non-existent-id')).rejects.toThrow(
        MaintenanceRecordNotFoundException,
      );
    });

    it('should throw if id is empty', async () => {
      await expect(deleteUseCase.execute('')).rejects.toThrow(
        InvalidArgumentException,
      );
    });
  });

  describe('GetMaintenanceHistoryUseCase', () => {
    it('should get maintenance history with pagination', async () => {
      const records = Array.from({ length: 100 }, (_, i) =>
        MaintenanceRecord.create({
          userMotocycleId: validUserMotocycleId,
          serviceType: ServiceType.OIL_CHANGE,
          performedAt: new Date(2024, 0, i + 1),
          odometerAtService: 10000 + i * 1000,
        }),
      );

      mockRepository.findByUserMotocycleId.mockResolvedValue(records);

      const result = await getHistoryUseCase.execute(validUserMotocycleId, {
        skip: 0,
        limit: 50,
      });

      expect(result.records).toHaveLength(50);
      expect(result.total).toBe(100);
      expect(result.hasMore).toBe(true);
      expect(result.skip).toBe(0);
      expect(result.limit).toBe(50);
    });

    it('should use default pagination values', async () => {
      const records = Array.from({ length: 25 }, (_, i) =>
        MaintenanceRecord.create({
          userMotocycleId: validUserMotocycleId,
          serviceType: ServiceType.OIL_CHANGE,
          performedAt: validDate,
          odometerAtService: 10000 + i * 1000,
        }),
      );

      mockRepository.findByUserMotocycleId.mockResolvedValue(records);

      const result = await getHistoryUseCase.execute(validUserMotocycleId);

      expect(result.skip).toBe(0);
      expect(result.limit).toBe(50);
      expect(result.records).toHaveLength(25);
      expect(result.hasMore).toBe(false);
    });

    it('should handle last page correctly', async () => {
      const records = Array.from({ length: 100 }, (_, i) =>
        MaintenanceRecord.create({
          userMotocycleId: validUserMotocycleId,
          serviceType: ServiceType.OIL_CHANGE,
          performedAt: validDate,
          odometerAtService: 10000 + i * 1000,
        }),
      );

      mockRepository.findByUserMotocycleId.mockResolvedValue(records);

      const result = await getHistoryUseCase.execute(validUserMotocycleId, {
        skip: 50,
        limit: 50,
      });

      expect(result.records).toHaveLength(50);
      expect(result.hasMore).toBe(false);
    });

    it('should throw if skip is negative', async () => {
      await expect(
        getHistoryUseCase.execute(validUserMotocycleId, {
          skip: -1,
          limit: 50,
        }),
      ).rejects.toThrow(InvalidArgumentException);
    });

    it('should throw if limit is invalid', async () => {
      await expect(
        getHistoryUseCase.execute(validUserMotocycleId, { skip: 0, limit: 0 }),
      ).rejects.toThrow(InvalidArgumentException);

      await expect(
        getHistoryUseCase.execute(validUserMotocycleId, {
          skip: 0,
          limit: 501,
        }),
      ).rejects.toThrow(InvalidArgumentException);
    });
  });
});
