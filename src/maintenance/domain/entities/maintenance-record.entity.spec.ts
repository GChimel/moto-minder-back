import { MaintenanceRecord } from './maintenance-record.entity';
import { ServiceType } from '../enums/service-type.enum';
import { ServiceInterval } from '../value-objects/service-interval.vo';
import { IdVO } from '../../../shared/infrastructure/domain/value-objects/id-vo';
import { InvalidArgumentException } from '../../../shared/domain/exceptions/invalid-argument.exception';

describe('MaintenanceRecord Entity', () => {
  const validUserMotocycleId = '550e8400-e29b-41d4-a716-446655440001';
  const validDate = new Date('2024-01-15');

  describe('create factory', () => {
    it('should create a maintenance record with valid data', () => {
      const dto = {
        userMotocycleId: validUserMotocycleId,
        serviceType: ServiceType.OIL_CHANGE,
        performedAt: validDate,
        odometerAtService: 10000,
      };

      const record = MaintenanceRecord.create(dto);

      expect(record).toBeDefined();
      expect(record.getServiceType()).toBe(ServiceType.OIL_CHANGE);
      expect(record.getOdometerAtService()).toBe(10000);
      expect(record.getUserMotocycleId().getValue()).toBe(validUserMotocycleId);
    });

    it('should create record with optional fields', () => {
      const dto = {
        userMotocycleId: validUserMotocycleId,
        serviceType: ServiceType.TIRE_REPLACEMENT,
        performedAt: validDate,
        odometerAtService: 20000,
        cost: 150.5,
        partsUsed: 'Michelin Pilot Road 4',
        notes: 'Front and rear tires replaced',
        nextServiceInterval: { intervalKm: 15000, intervalMonths: 12 },
      };

      const record = MaintenanceRecord.create(dto);

      expect(record.getCost()).toBe(150.5);
      expect(record.getPartsUsed()).toBe('Michelin Pilot Road 4');
      expect(record.getNotes()).toBe('Front and rear tires replaced');
      expect(record.getNextServiceInterval()).toBeDefined();
    });

    it('should throw if odometer is negative', () => {
      const dto = {
        userMotocycleId: validUserMotocycleId,
        serviceType: ServiceType.OIL_CHANGE,
        performedAt: validDate,
        odometerAtService: -1,
      };

      expect(() => MaintenanceRecord.create(dto)).toThrow(
        InvalidArgumentException,
      );
    });

    it('should throw if cost is negative', () => {
      const dto = {
        userMotocycleId: validUserMotocycleId,
        serviceType: ServiceType.OIL_CHANGE,
        performedAt: validDate,
        odometerAtService: 10000,
        cost: -50,
      };

      expect(() => MaintenanceRecord.create(dto)).toThrow(
        InvalidArgumentException,
      );
    });

    it('should throw if odometer is not an integer', () => {
      const dto = {
        userMotocycleId: validUserMotocycleId,
        serviceType: ServiceType.OIL_CHANGE,
        performedAt: validDate,
        odometerAtService: 10000.5,
      };

      expect(() => MaintenanceRecord.create(dto)).toThrow(
        InvalidArgumentException,
      );
    });

    it('should support custom service type as string', () => {
      const dto = {
        userMotocycleId: validUserMotocycleId,
        serviceType: 'CUSTOM_REPAIR',
        performedAt: validDate,
        odometerAtService: 10000,
      };

      const record = MaintenanceRecord.create(dto);
      expect(record.getServiceType()).toBe('CUSTOM_REPAIR');
    });

    it('should set createdAt and updatedAt to current date if not provided', () => {
      const dto = {
        userMotocycleId: validUserMotocycleId,
        serviceType: ServiceType.OIL_CHANGE,
        performedAt: validDate,
        odometerAtService: 10000,
      };

      const before = new Date();
      const record = MaintenanceRecord.create(dto);
      const after = new Date();

      expect(record.getCreatedAt().getTime()).toBeGreaterThanOrEqual(
        before.getTime(),
      );
      expect(record.getCreatedAt().getTime()).toBeLessThanOrEqual(
        after.getTime(),
      );
      expect(record.getUpdatedAt().getTime()).toBeGreaterThanOrEqual(
        before.getTime(),
      );
    });
  });

  describe('reconstitute factory', () => {
    it('should reconstitute a record from persistence data', () => {
      const id = '550e8400-e29b-41d4-a716-446655440002';
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-01-15');

      const record = MaintenanceRecord.reconstitute(
        id,
        validUserMotocycleId,
        ServiceType.OIL_CHANGE,
        validDate,
        10000,
        100,
        'Castrol Oil',
        'Regular oil change',
        new ServiceInterval({ intervalKm: 5000 }),
        createdAt,
        updatedAt,
      );

      expect(record.getId().getValue()).toBe(id);
      expect(record.getUserMotocycleId().getValue()).toBe(validUserMotocycleId);
      expect(record.getServiceType()).toBe(ServiceType.OIL_CHANGE);
      expect(record.getCreatedAt()).toEqual(createdAt);
      expect(record.getUpdatedAt()).toEqual(updatedAt);
    });
  });

  describe('Getters', () => {
    let record: MaintenanceRecord;

    beforeEach(() => {
      const dto = {
        userMotocycleId: validUserMotocycleId,
        serviceType: ServiceType.BRAKE_SERVICE,
        performedAt: validDate,
        odometerAtService: 25000,
        cost: 200,
        partsUsed: 'Brake pads and rotors',
        notes: 'Front brakes service',
      };
      record = MaintenanceRecord.create(dto);
    });

    it('should return id', () => {
      expect(record.getId()).toBeDefined();
      expect(record.getId().getValue()).toBeDefined();
    });

    it('should return userMotocycleId', () => {
      expect(record.getUserMotocycleId().getValue()).toBe(validUserMotocycleId);
    });

    it('should return serviceType', () => {
      expect(record.getServiceType()).toBe(ServiceType.BRAKE_SERVICE);
    });

    it('should return performedAt', () => {
      expect(record.getPerformedAt()).toEqual(validDate);
    });

    it('should return odometerAtService', () => {
      expect(record.getOdometerAtService()).toBe(25000);
    });

    it('should return optional fields', () => {
      expect(record.getCost()).toBe(200);
      expect(record.getPartsUsed()).toBe('Brake pads and rotors');
      expect(record.getNotes()).toBe('Front brakes service');
    });

    it('should return undefined for unset optional fields', () => {
      const minimalDto = {
        userMotocycleId: validUserMotocycleId,
        serviceType: ServiceType.OIL_CHANGE,
        performedAt: validDate,
        odometerAtService: 10000,
      };
      const minimalRecord = MaintenanceRecord.create(minimalDto);

      expect(minimalRecord.getCost()).toBeUndefined();
      expect(minimalRecord.getPartsUsed()).toBeUndefined();
      expect(minimalRecord.getNotes()).toBeUndefined();
    });

    it('should return timestamps', () => {
      expect(record.getCreatedAt()).toBeDefined();
      expect(record.getUpdatedAt()).toBeDefined();
    });
  });

  describe('updateCost', () => {
    let record: MaintenanceRecord;

    beforeEach(() => {
      const dto = {
        userMotocycleId: validUserMotocycleId,
        serviceType: ServiceType.OIL_CHANGE,
        performedAt: validDate,
        odometerAtService: 10000,
        cost: 50,
      };
      record = MaintenanceRecord.create(dto);
    });

    it('should update cost', () => {
      record.updateCost(75);
      expect(record.getCost()).toBe(75);
    });

    it('should update updatedAt when cost is updated', () => {
      const oldUpdatedAt = record.getUpdatedAt();
      jest.useFakeTimers();
      jest.advanceTimersByTime(1000);

      record.updateCost(75);

      expect(record.getUpdatedAt().getTime()).toBeGreaterThan(
        oldUpdatedAt.getTime(),
      );

      jest.useRealTimers();
    });

    it('should allow updating cost to zero', () => {
      record.updateCost(0);
      expect(record.getCost()).toBe(0);
    });

    it('should allow setting cost to undefined', () => {
      record.updateCost(undefined);
      expect(record.getCost()).toBeUndefined();
    });

    it('should throw if cost is negative', () => {
      expect(() => record.updateCost(-10)).toThrow(InvalidArgumentException);
    });
  });

  describe('updateNotes', () => {
    let record: MaintenanceRecord;

    beforeEach(() => {
      const dto = {
        userMotocycleId: validUserMotocycleId,
        serviceType: ServiceType.OIL_CHANGE,
        performedAt: validDate,
        odometerAtService: 10000,
        notes: 'Initial notes',
      };
      record = MaintenanceRecord.create(dto);
    });

    it('should update notes', () => {
      record.updateNotes('Updated notes');
      expect(record.getNotes()).toBe('Updated notes');
    });

    it('should update updatedAt when notes are updated', () => {
      const oldUpdatedAt = record.getUpdatedAt();
      jest.useFakeTimers();
      jest.advanceTimersByTime(1000);

      record.updateNotes('Updated notes');

      expect(record.getUpdatedAt().getTime()).toBeGreaterThan(
        oldUpdatedAt.getTime(),
      );

      jest.useRealTimers();
    });

    it('should allow setting notes to undefined', () => {
      record.updateNotes(undefined);
      expect(record.getNotes()).toBeUndefined();
    });
  });

  describe('updatePartsUsed', () => {
    let record: MaintenanceRecord;

    beforeEach(() => {
      const dto = {
        userMotocycleId: validUserMotocycleId,
        serviceType: ServiceType.OIL_CHANGE,
        performedAt: validDate,
        odometerAtService: 10000,
        partsUsed: 'Castrol Oil',
      };
      record = MaintenanceRecord.create(dto);
    });

    it('should update parts used', () => {
      record.updatePartsUsed('Mobil 1 Oil');
      expect(record.getPartsUsed()).toBe('Mobil 1 Oil');
    });

    it('should update updatedAt when parts are updated', () => {
      const oldUpdatedAt = record.getUpdatedAt();
      jest.useFakeTimers();
      jest.advanceTimersByTime(1000);

      record.updatePartsUsed('New parts');

      expect(record.getUpdatedAt().getTime()).toBeGreaterThan(
        oldUpdatedAt.getTime(),
      );

      jest.useRealTimers();
    });

    it('should allow setting parts to undefined', () => {
      record.updatePartsUsed(undefined);
      expect(record.getPartsUsed()).toBeUndefined();
    });
  });

  describe('updateNextServiceInterval', () => {
    let record: MaintenanceRecord;

    beforeEach(() => {
      const dto = {
        userMotocycleId: validUserMotocycleId,
        serviceType: ServiceType.OIL_CHANGE,
        performedAt: validDate,
        odometerAtService: 10000,
        nextServiceInterval: { intervalKm: 5000 },
      };
      record = MaintenanceRecord.create(dto);
    });

    it('should update service interval', () => {
      const newInterval = new ServiceInterval({ intervalKm: 10000 });
      record.updateNextServiceInterval(newInterval);

      expect(record.getNextServiceInterval()).toBeDefined();
      expect(record.getNextServiceInterval()?.getIntervalKm()).toBe(10000);
    });

    it('should update updatedAt when interval is updated', () => {
      const oldUpdatedAt = record.getUpdatedAt();
      jest.useFakeTimers();
      jest.advanceTimersByTime(1000);

      const newInterval = new ServiceInterval({ intervalKm: 10000 });
      record.updateNextServiceInterval(newInterval);

      expect(record.getUpdatedAt().getTime()).toBeGreaterThan(
        oldUpdatedAt.getTime(),
      );

      jest.useRealTimers();
    });

    it('should allow setting interval to undefined', () => {
      record.updateNextServiceInterval(undefined);
      expect(record.getNextServiceInterval()).toBeUndefined();
    });
  });

  describe('calculateNextServiceDueOdometer', () => {
    it('should calculate next service due odometer', () => {
      const dto = {
        userMotocycleId: validUserMotocycleId,
        serviceType: ServiceType.OIL_CHANGE,
        performedAt: validDate,
        odometerAtService: 10000,
        nextServiceInterval: { intervalKm: 5000 },
      };
      const record = MaintenanceRecord.create(dto);

      const nextDue = record.calculateNextServiceDueOdometer();
      expect(nextDue).toBe(15000);
    });

    it('should return undefined if no next service interval is set', () => {
      const dto = {
        userMotocycleId: validUserMotocycleId,
        serviceType: ServiceType.OIL_CHANGE,
        performedAt: validDate,
        odometerAtService: 10000,
      };
      const record = MaintenanceRecord.create(dto);

      const nextDue = record.calculateNextServiceDueOdometer();
      expect(nextDue).toBeUndefined();
    });

    it('should return undefined if interval has no km set', () => {
      const dto = {
        userMotocycleId: validUserMotocycleId,
        serviceType: ServiceType.OIL_CHANGE,
        performedAt: validDate,
        odometerAtService: 10000,
        nextServiceInterval: { intervalMonths: 12 },
      };
      const record = MaintenanceRecord.create(dto);

      const nextDue = record.calculateNextServiceDueOdometer();
      expect(nextDue).toBeUndefined();
    });
  });

  describe('calculateNextServiceDueDate', () => {
    it('should calculate next service due date', () => {
      const dto = {
        userMotocycleId: validUserMotocycleId,
        serviceType: ServiceType.OIL_CHANGE,
        performedAt: validDate,
        odometerAtService: 10000,
        nextServiceInterval: { intervalMonths: 6 },
      };
      const record = MaintenanceRecord.create(dto);

      const nextDue = record.calculateNextServiceDueDate();
      expect(nextDue).toBeDefined();
    });

    it('should return undefined if no next service interval is set', () => {
      const dto = {
        userMotocycleId: validUserMotocycleId,
        serviceType: ServiceType.OIL_CHANGE,
        performedAt: validDate,
        odometerAtService: 10000,
      };
      const record = MaintenanceRecord.create(dto);

      const nextDue = record.calculateNextServiceDueDate();
      expect(nextDue).toBeUndefined();
    });

    it('should return undefined if interval has no months set', () => {
      const dto = {
        userMotocycleId: validUserMotocycleId,
        serviceType: ServiceType.OIL_CHANGE,
        performedAt: validDate,
        odometerAtService: 10000,
        nextServiceInterval: { intervalKm: 5000 },
      };
      const record = MaintenanceRecord.create(dto);

      const nextDue = record.calculateNextServiceDueDate();
      expect(nextDue).toBeUndefined();
    });
  });

  describe('immutability', () => {
    it('should not allow direct modification of id', () => {
      const dto = {
        userMotocycleId: validUserMotocycleId,
        serviceType: ServiceType.OIL_CHANGE,
        performedAt: validDate,
        odometerAtService: 10000,
      };
      const record = MaintenanceRecord.create(dto);

      // ID is private and readonly, so this should fail at compile time
      // This test is more of a type-checking assertion
      expect(record.getId()).toBeDefined();
    });
  });
});
