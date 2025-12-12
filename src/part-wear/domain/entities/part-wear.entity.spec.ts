import { PartWear } from './part-wear.entity';
import { WearPercentage } from '../value-objects/wear-percentage.vo';
import { IdVO } from '../../../shared/infrastructure/domain/value-objects/id-vo';
import { Odometer } from '../../../shared/domain/value-objects/odometer.vo';

describe('PartWear Entity', () => {
  describe('create', () => {
    it('should create a part wear record with valid properties', () => {
      const motorcyclePartId = new IdVO();
      const wearPercentage = WearPercentage.create(25);
      const lastKnownOdometer = new Odometer(10000);
      const now = new Date();

      const partWear = PartWear.create({
        motorcyclePartId,
        currentWearPercentage: wearPercentage,
        lastCalculatedAt: now,
        lastKnownOdometer,
        projectedReplacementOdometer: 20000,
        isMaintenanceDue: false,
      });

      expect(partWear.getId()).toBeDefined();
      expect(partWear.getMotorcyclePartId().equals(motorcyclePartId)).toBe(
        true,
      );
      expect(partWear.getCurrentWearPercentage().getValue()).toBe(25);
      expect(partWear.getLastKnownOdometer().getValue()).toBe(10000);
      expect(partWear.getProjectedReplacementOdometer()).toBe(20000);
      expect(partWear.isMaintenanceDueStatus()).toBe(false);
    });

    it('should auto-generate id if not provided', () => {
      const partWear = PartWear.create({
        motorcyclePartId: new IdVO(),
        currentWearPercentage: WearPercentage.zero(),
        lastCalculatedAt: new Date(),
        lastKnownOdometer: new Odometer(10000),
        projectedReplacementOdometer: 20000,
        isMaintenanceDue: false,
      });

      expect(partWear.getId()).toBeDefined();
    });

    it('should auto-generate timestamps if not provided', () => {
      const partWear = PartWear.create({
        motorcyclePartId: new IdVO(),
        currentWearPercentage: WearPercentage.zero(),
        lastCalculatedAt: new Date(),
        lastKnownOdometer: new Odometer(10000),
        projectedReplacementOdometer: 20000,
        isMaintenanceDue: false,
      });

      expect(partWear.getCreatedAt()).toBeDefined();
      expect(partWear.getUpdatedAt()).toBeDefined();
    });

    it('should accept optional projected replacement date', () => {
      const projectedDate = new Date('2025-01-01');
      const partWear = PartWear.create({
        motorcyclePartId: new IdVO(),
        currentWearPercentage: WearPercentage.create(50),
        lastCalculatedAt: new Date(),
        lastKnownOdometer: new Odometer(10000),
        projectedReplacementOdometer: 20000,
        isMaintenanceDue: true,
        projectedReplacementDate: projectedDate,
      });

      expect(partWear.getProjectedReplacementDate()).toEqual(projectedDate);
    });
  });

  describe('reconstitute', () => {
    it('should reconstitute from database properties', () => {
      const id = new IdVO();
      const motorcyclePartId = new IdVO();
      const createdAt = new Date('2024-01-01');
      const updatedAt = new Date('2024-02-01');

      const partWear = PartWear.reconstitute({
        id,
        motorcyclePartId,
        currentWearPercentage: WearPercentage.create(75),
        lastCalculatedAt: new Date(),
        lastKnownOdometer: new Odometer(15000),
        projectedReplacementOdometer: 20000,
        isMaintenanceDue: true,
        createdAt,
        updatedAt,
      });

      expect(partWear.getId().equals(id)).toBe(true);
      expect(partWear.getCreatedAt()).toEqual(createdAt);
      expect(partWear.getUpdatedAt()).toEqual(updatedAt);
    });
  });

  describe('getters', () => {
    let partWear: PartWear;
    const motorcyclePartId = new IdVO();
    const wearPercentage = WearPercentage.create(45);
    const lastKnownOdometer = new Odometer(12000);
    const now = new Date();
    const projectionDate = new Date('2025-06-01');

    beforeEach(() => {
      partWear = PartWear.create({
        motorcyclePartId,
        currentWearPercentage: wearPercentage,
        lastCalculatedAt: now,
        lastKnownOdometer,
        projectedReplacementOdometer: 22000,
        isMaintenanceDue: true,
        projectedReplacementDate: projectionDate,
      });
    });

    it('should get motorcycle part id', () => {
      expect(partWear.getMotorcyclePartId().equals(motorcyclePartId)).toBe(
        true,
      );
    });

    it('should get current wear percentage', () => {
      expect(partWear.getCurrentWearPercentage().getValue()).toBe(45);
    });

    it('should get last calculated at', () => {
      expect(partWear.getLastCalculatedAt()).toEqual(now);
    });

    it('should get last known odometer', () => {
      expect(partWear.getLastKnownOdometer().getValue()).toBe(12000);
    });

    it('should get projected replacement odometer', () => {
      expect(partWear.getProjectedReplacementOdometer()).toBe(22000);
    });

    it('should get projected replacement date', () => {
      expect(partWear.getProjectedReplacementDate()).toEqual(projectionDate);
    });

    it('should get maintenance due status', () => {
      expect(partWear.isMaintenanceDueStatus()).toBe(true);
    });

    it('should get created at timestamp', () => {
      expect(partWear.getCreatedAt()).toBeDefined();
    });

    it('should get updated at timestamp', () => {
      expect(partWear.getUpdatedAt()).toBeDefined();
    });
  });

  describe('updateWear', () => {
    it('should update wear metrics', () => {
      const partWear = PartWear.create({
        motorcyclePartId: new IdVO(),
        currentWearPercentage: WearPercentage.create(25),
        lastCalculatedAt: new Date('2024-01-01'),
        lastKnownOdometer: new Odometer(10000),
        projectedReplacementOdometer: 20000,
        isMaintenanceDue: false,
      });

      const newWear = WearPercentage.create(65);
      const newOdometer = new Odometer(15000);
      const newProjectedOdometer = 20000;
      const newProjectedDate = new Date('2025-06-01');

      partWear.updateWear(
        newWear,
        newOdometer,
        newProjectedOdometer,
        true,
        newProjectedDate,
      );

      expect(partWear.getCurrentWearPercentage().getValue()).toBe(65);
      expect(partWear.getLastKnownOdometer().getValue()).toBe(15000);
      expect(partWear.getProjectedReplacementOdometer()).toBe(20000);
      expect(partWear.isMaintenanceDueStatus()).toBe(true);
      expect(partWear.getProjectedReplacementDate()).toEqual(newProjectedDate);
    });

    it('should update last calculated at timestamp', () => {
      const partWear = PartWear.create({
        motorcyclePartId: new IdVO(),
        currentWearPercentage: WearPercentage.zero(),
        lastCalculatedAt: new Date('2024-01-01'),
        lastKnownOdometer: new Odometer(10000),
        projectedReplacementOdometer: 20000,
        isMaintenanceDue: false,
      });

      const originalCalculatedAt = partWear.getLastCalculatedAt();

      partWear.updateWear(
        WearPercentage.create(50),
        new Odometer(15000),
        20000,
        true,
      );

      expect(partWear.getLastCalculatedAt()).not.toEqual(originalCalculatedAt);
      expect(partWear.getLastCalculatedAt().getTime()).toBeGreaterThanOrEqual(
        originalCalculatedAt.getTime(),
      );
    });

    it('should update updated at timestamp', () => {
      const partWear = PartWear.create({
        motorcyclePartId: new IdVO(),
        currentWearPercentage: WearPercentage.zero(),
        lastCalculatedAt: new Date(),
        lastKnownOdometer: new Odometer(10000),
        projectedReplacementOdometer: 20000,
        isMaintenanceDue: false,
        updatedAt: new Date('2024-01-01'),
      });

      const originalUpdatedAt = partWear.getUpdatedAt();

      partWear.updateWear(
        WearPercentage.create(50),
        new Odometer(15000),
        20000,
        false,
      );

      expect(partWear.getUpdatedAt().getTime()).toBeGreaterThanOrEqual(
        originalUpdatedAt.getTime(),
      );
    });

    it('should allow clearing projected replacement date', () => {
      const partWear = PartWear.create({
        motorcyclePartId: new IdVO(),
        currentWearPercentage: WearPercentage.create(50),
        lastCalculatedAt: new Date(),
        lastKnownOdometer: new Odometer(10000),
        projectedReplacementOdometer: 20000,
        isMaintenanceDue: true,
        projectedReplacementDate: new Date('2025-01-01'),
      });

      partWear.updateWear(
        WearPercentage.create(60),
        new Odometer(12000),
        20000,
        true,
      );

      expect(partWear.getProjectedReplacementDate()).toBeUndefined();
    });
  });

  describe('resetWear', () => {
    it('should reset wear to zero', () => {
      const partWear = PartWear.create({
        motorcyclePartId: new IdVO(),
        currentWearPercentage: WearPercentage.create(75),
        lastCalculatedAt: new Date(),
        lastKnownOdometer: new Odometer(15000),
        projectedReplacementOdometer: 20000,
        isMaintenanceDue: true,
      });

      partWear.resetWear();

      expect(partWear.getCurrentWearPercentage().getValue()).toBe(0);
      expect(partWear.isMaintenanceDueStatus()).toBe(false);
    });

    it('should update timestamps on reset', () => {
      const partWear = PartWear.create({
        motorcyclePartId: new IdVO(),
        currentWearPercentage: WearPercentage.create(50),
        lastCalculatedAt: new Date('2024-01-01'),
        lastKnownOdometer: new Odometer(10000),
        projectedReplacementOdometer: 20000,
        isMaintenanceDue: true,
      });

      const originalCalculatedAt = partWear.getLastCalculatedAt();
      const originalUpdatedAt = partWear.getUpdatedAt();

      partWear.resetWear();

      expect(partWear.getLastCalculatedAt().getTime()).toBeGreaterThanOrEqual(
        originalCalculatedAt.getTime(),
      );
      expect(partWear.getUpdatedAt().getTime()).toBeGreaterThanOrEqual(
        originalUpdatedAt.getTime(),
      );
    });
  });

  describe('equals', () => {
    it('should return true for parts with same id', () => {
      const id = new IdVO();
      const partWear1 = PartWear.create({
        id,
        motorcyclePartId: new IdVO(),
        currentWearPercentage: WearPercentage.create(50),
        lastCalculatedAt: new Date(),
        lastKnownOdometer: new Odometer(10000),
        projectedReplacementOdometer: 20000,
        isMaintenanceDue: false,
      });

      const partWear2 = PartWear.create({
        id,
        motorcyclePartId: new IdVO(),
        currentWearPercentage: WearPercentage.create(75),
        lastCalculatedAt: new Date(),
        lastKnownOdometer: new Odometer(15000),
        projectedReplacementOdometer: 20000,
        isMaintenanceDue: true,
      });

      expect(partWear1.equals(partWear2)).toBe(true);
    });

    it('should return false for parts with different ids', () => {
      const partWear1 = PartWear.create({
        motorcyclePartId: new IdVO(),
        currentWearPercentage: WearPercentage.create(50),
        lastCalculatedAt: new Date(),
        lastKnownOdometer: new Odometer(10000),
        projectedReplacementOdometer: 20000,
        isMaintenanceDue: false,
      });

      const partWear2 = PartWear.create({
        motorcyclePartId: new IdVO(),
        currentWearPercentage: WearPercentage.create(50),
        lastCalculatedAt: new Date(),
        lastKnownOdometer: new Odometer(10000),
        projectedReplacementOdometer: 20000,
        isMaintenanceDue: false,
      });

      expect(partWear1.equals(partWear2)).toBe(false);
    });
  });
});
