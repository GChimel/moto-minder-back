import { WearCalculationService } from './wear-calculation.service';
import { MotorcyclePart } from '../../../motorcycle-part/domain/entities/motorcycle-part.entity';
import { Odometer } from '../../../shared/domain/value-objects/odometer.vo';
import { PartType } from '../../../motorcycle-part/domain/enums/part-type.enum';
import { PartCategory } from '../../../motorcycle-part/domain/enums/part-category.enum';

describe('WearCalculationService', () => {
  let service: WearCalculationService;

  beforeEach(() => {
    service = new WearCalculationService();
  });

  describe('calculateWear with wear rate', () => {
    it('should calculate wear percentage using wear rate per km', () => {
      const part = MotorcyclePart.create({
        userMotocycleId: '550e8400-e29b-41d4-a716-446655440000',
        partType: PartType.CHAIN,
        partCategory: PartCategory.DRIVETRAIN,
        name: 'Standard Chain',
        installationDate: new Date('2024-01-01'),
        installationOdometer: 5000,
        expectedLifespanKm: 10000,
        wearRatePerKm: 0.0001,
        replacementThreshold: 70,
      });

      const currentOdometer = new Odometer(5500);
      const result = service.calculateWear(part, currentOdometer);

      expect(result.kilometersUsed).toBe(500);
      expect(result.wearPercentage.getValue()).toBe(5);
      expect(result.isMaintenanceDue).toBe(false);
    });

    it('should cap wear percentage at 100', () => {
      const part = MotorcyclePart.create({
        userMotocycleId: '550e8400-e29b-41d4-a716-446655440000',
        partType: PartType.CHAIN,
        partCategory: PartCategory.DRIVETRAIN,
        name: 'Standard Chain',
        installationDate: new Date('2024-01-01'),
        installationOdometer: 5000,
        expectedLifespanKm: 10000,
        wearRatePerKm: 0.001,
        replacementThreshold: 70,
      });

      const currentOdometer = new Odometer(50000);
      const result = service.calculateWear(part, currentOdometer);

      expect(result.wearPercentage.getValue()).toBe(100);
      expect(result.isMaintenanceDue).toBe(true);
    });
  });

  describe('calculateWear with lifespan only', () => {
    it('should calculate wear based on expected lifespan in km', () => {
      const part = MotorcyclePart.create({
        userMotocycleId: '550e8400-e29b-41d4-a716-446655440000',
        partType: PartType.FRONT_TIRE,
        partCategory: PartCategory.TIRES,
        name: 'Bridgestone Battlax',
        installationDate: new Date('2024-01-01'),
        installationOdometer: 10000,
        expectedLifespanKm: 15000,
        replacementThreshold: 70,
      });

      const currentOdometer = new Odometer(17500);
      const result = service.calculateWear(part, currentOdometer);

      expect(result.kilometersUsed).toBe(7500);
      expect(result.wearPercentage.getValue()).toBeCloseTo(50);
      expect(result.isMaintenanceDue).toBe(false);
    });

    it('should calculate wear as 0% with no kilometers driven', () => {
      const part = MotorcyclePart.create({
        userMotocycleId: '550e8400-e29b-41d4-a716-446655440000',
        partType: PartType.FRONT_TIRE,
        partCategory: PartCategory.TIRES,
        name: 'Bridgestone Battlax',
        installationDate: new Date('2024-01-01'),
        installationOdometer: 10000,
        expectedLifespanKm: 15000,
        replacementThreshold: 70,
      });

      const currentOdometer = new Odometer(10000);
      const result = service.calculateWear(part, currentOdometer);

      expect(result.kilometersUsed).toBe(0);
      expect(result.wearPercentage.getValue()).toBe(0);
      expect(result.isMaintenanceDue).toBe(false);
    });
  });

  describe('calculateWear with no metrics', () => {
    it('should return zero wear when no wear metrics are provided', () => {
      const part = MotorcyclePart.create({
        userMotocycleId: '550e8400-e29b-41d4-a716-446655440000',
        partType: PartType.BATTERY,
        partCategory: PartCategory.ELECTRICAL,
        name: 'Standard Battery',
        installationDate: new Date('2024-01-01'),
        installationOdometer: 10000,
        replacementThreshold: 70,
      });

      const currentOdometer = new Odometer(15000);
      const result = service.calculateWear(part, currentOdometer);

      expect(result.wearPercentage.getValue()).toBe(0);
      expect(result.isMaintenanceDue).toBe(false);
    });
  });

  describe('calculateWear with maintenance threshold', () => {
    it('should mark maintenance due when wear reaches threshold', () => {
      const part = MotorcyclePart.create({
        userMotocycleId: '550e8400-e29b-41d4-a716-446655440000',
        partType: PartType.ENGINE_OIL,
        partCategory: PartCategory.ENGINE,
        name: 'Mobil 1 5W-40',
        installationDate: new Date('2024-01-01'),
        installationOdometer: 5000,
        expectedLifespanKm: 10000,
        replacementThreshold: 70,
      });

      const currentOdometer = new Odometer(12000);
      const result = service.calculateWear(part, currentOdometer);

      expect(result.wearPercentage.getValue()).toBeCloseTo(70);
      expect(result.isMaintenanceDue).toBe(true);
    });

    it('should use custom replacement threshold', () => {
      const part = MotorcyclePart.create({
        userMotocycleId: '550e8400-e29b-41d4-a716-446655440000',
        partType: PartType.ENGINE_OIL,
        partCategory: PartCategory.ENGINE,
        name: 'Mobil 1 5W-40',
        installationDate: new Date('2024-01-01'),
        installationOdometer: 5000,
        expectedLifespanKm: 10000,
        replacementThreshold: 50,
      });

      const currentOdometer = new Odometer(10000);
      const result = service.calculateWear(part, currentOdometer);

      expect(result.wearPercentage.getValue()).toBeCloseTo(50);
      expect(result.isMaintenanceDue).toBe(true);
    });
  });

  describe('calculateWear with negative odometer difference', () => {
    it('should handle odometer reset scenario gracefully', () => {
      const part = MotorcyclePart.create({
        userMotocycleId: '550e8400-e29b-41d4-a716-446655440000',
        partType: PartType.CHAIN,
        partCategory: PartCategory.DRIVETRAIN,
        name: 'Chain',
        installationDate: new Date('2024-01-01'),
        installationOdometer: 50000,
        expectedLifespanKm: 10000,
        replacementThreshold: 70,
      });

      const currentOdometer = new Odometer(40000);
      const result = service.calculateWear(part, currentOdometer);

      expect(result.kilometersUsed).toBe(0);
      expect(result.wearPercentage.getValue()).toBe(0);
    });
  });

  describe('projectedReplacementKm', () => {
    it('should calculate projected replacement odometer with wear rate', () => {
      const part = MotorcyclePart.create({
        userMotocycleId: '550e8400-e29b-41d4-a716-446655440000',
        partType: PartType.CHAIN,
        partCategory: PartCategory.DRIVETRAIN,
        name: 'Chain',
        installationDate: new Date('2024-01-01'),
        installationOdometer: 5000,
        expectedLifespanKm: 10000,
        wearRatePerKm: 0.0001,
        replacementThreshold: 70,
      });

      const currentOdometer = new Odometer(5000);
      const result = service.calculateWear(part, currentOdometer);

      expect(result.projectedReplacementKm).toBeGreaterThan(5000);
    });

    it('should calculate projected replacement with lifespan', () => {
      const part = MotorcyclePart.create({
        userMotocycleId: '550e8400-e29b-41d4-a716-446655440000',
        partType: PartType.FRONT_TIRE,
        partCategory: PartCategory.TIRES,
        name: 'Tire',
        installationDate: new Date('2024-01-01'),
        installationOdometer: 10000,
        expectedLifespanKm: 15000,
        replacementThreshold: 70,
      });

      const currentOdometer = new Odometer(10000);
      const result = service.calculateWear(part, currentOdometer);

      expect(result.projectedReplacementKm).toBe(25000);
    });

    it('should return 0 when no lifespan metrics', () => {
      const part = MotorcyclePart.create({
        userMotocycleId: '550e8400-e29b-41d4-a716-446655440000',
        partType: PartType.BATTERY,
        partCategory: PartCategory.ELECTRICAL,
        name: 'Battery',
        installationDate: new Date('2024-01-01'),
        installationOdometer: 10000,
        replacementThreshold: 70,
      });

      const currentOdometer = new Odometer(10000);
      const result = service.calculateWear(part, currentOdometer);

      expect(result.projectedReplacementKm).toBe(0);
    });
  });

  describe('projectedReplacementDate', () => {
    it.skip('should calculate projected replacement date based on lifespan months', () => {
      const installationDate = new Date('2024-01-01');
      const part = MotorcyclePart.create({
        userMotocycleId: '550e8400-e29b-41d4-a716-446655440000',
        partType: PartType.ENGINE_OIL,
        partCategory: PartCategory.ENGINE,
        name: 'Oil',
        installationDate,
        installationOdometer: 10000,
        expectedLifespanMonths: 12,
        replacementThreshold: 70,
      });

      const currentOdometer = new Odometer(10000);
      const result = service.calculateWear(part, currentOdometer);

      expect(result.projectedReplacementDate).toBeDefined();
      if (result.projectedReplacementDate) {
        expect(
          result.projectedReplacementDate.getFullYear(),
        ).toBeGreaterThanOrEqual(2025);
      }
    });

    it('should return undefined when no lifespan in months', () => {
      const part = MotorcyclePart.create({
        userMotocycleId: '550e8400-e29b-41d4-a716-446655440000',
        partType: PartType.FRONT_TIRE,
        partCategory: PartCategory.TIRES,
        name: 'Tire',
        installationDate: new Date('2024-01-01'),
        installationOdometer: 10000,
        expectedLifespanKm: 15000,
        replacementThreshold: 70,
      });

      const currentOdometer = new Odometer(10000);
      const result = service.calculateWear(part, currentOdometer);

      expect(result.projectedReplacementDate).toBeUndefined();
    });
  });

  describe('edge cases', () => {
    it('should handle decimal kilometers correctly', () => {
      const part = MotorcyclePart.create({
        userMotocycleId: '550e8400-e29b-41d4-a716-446655440000',
        partType: PartType.CHAIN,
        partCategory: PartCategory.DRIVETRAIN,
        name: 'Chain',
        installationDate: new Date('2024-01-01'),
        installationOdometer: 5000,
        expectedLifespanKm: 10000,
        replacementThreshold: 70,
      });

      const currentOdometer = new Odometer(5750);
      const result = service.calculateWear(part, currentOdometer);

      expect(result.kilometersUsed).toBe(750);
      expect(result.wearPercentage.getValue()).toBeCloseTo(7.5);
    });

    it.skip('should handle very small wear rate correctly', () => {
      const part = MotorcyclePart.create({
        userMotocycleId: '550e8400-e29b-41d4-a716-446655440000',
        partType: PartType.ENGINE_OIL,
        partCategory: PartCategory.ENGINE,
        name: 'Oil',
        installationDate: new Date('2024-01-01'),
        installationOdometer: 10000,
        wearRatePerKm: 0.00001,
        replacementThreshold: 70,
      });

      const currentOdometer = new Odometer(15000);
      const result = service.calculateWear(part, currentOdometer);

      expect(result.wearPercentage.getValue()).toBeLessThan(0.1);
      expect(result.wearPercentage.getValue()).toBeGreaterThan(0);
      expect(result.isMaintenanceDue).toBe(false);
    });
  });
});
