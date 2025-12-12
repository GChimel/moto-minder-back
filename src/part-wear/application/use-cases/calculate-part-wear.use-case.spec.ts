import { CalculatePartWearUseCase } from './calculate-part-wear.use-case';
import { PartWear } from '../../domain/entities/part-wear.entity';
import { WearPercentage } from '../../domain/value-objects/wear-percentage.vo';
import { IdVO } from '../../../shared/infrastructure/domain/value-objects/id-vo';
import { Odometer } from '../../../shared/domain/value-objects/odometer.vo';
import { MotorcyclePart } from '../../../motorcycle-part/domain/entities/motorcycle-part.entity';
import { PartType } from '../../../motorcycle-part/domain/enums/part-type.enum';
import { PartCategory } from '../../../motorcycle-part/domain/enums/part-category.enum';
import {
  PartWearNotFoundException,
  InvalidWearCalculationException,
} from '../../domain/exceptions/part-wear.exceptions';

describe('CalculatePartWearUseCase', () => {
  let useCase: CalculatePartWearUseCase;
  let mockPartWearRepository: any;
  let mockMotorcyclePartRepository: any;

  beforeEach(() => {
    mockPartWearRepository = {
      findById: jest.fn(),
      save: jest.fn(),
    } as unknown as any;

    mockMotorcyclePartRepository = {
      findById: jest.fn(),
    } as unknown as any;

    useCase = new CalculatePartWearUseCase(
      mockPartWearRepository,
      mockMotorcyclePartRepository,
    );
  });

  describe('execute', () => {
    it('should calculate wear and update part wear record', async () => {
      const partWearId = new IdVO().getValue();
      const motorcyclePartId = new IdVO();
      const currentOdometer = 15000;

      const motorcyclePart = MotorcyclePart.create({
        userMotocycleId: new IdVO().getValue(),
        partType: PartType.FRONT_TIRE,
        partCategory: PartCategory.TIRES,
        name: 'Bridgestone Battlax',
        installationDate: new Date('2024-01-01'),
        installationOdometer: 10000,
        expectedLifespanKm: 15000,
        replacementThreshold: 70,
      });

      const partWear = PartWear.create({
        motorcyclePartId,
        currentWearPercentage: WearPercentage.create(10),
        lastCalculatedAt: new Date(),
        lastKnownOdometer: new Odometer(12000),
        projectedReplacementOdometer: 25000,
        isMaintenanceDue: false,
      });

      mockPartWearRepository.findById.mockResolvedValue(partWear);
      mockMotorcyclePartRepository.findById.mockResolvedValue(motorcyclePart);
      mockPartWearRepository.save.mockResolvedValue(partWear);

      const result = await useCase.execute(partWearId, currentOdometer);

      expect(result.partWear).toBeDefined();
      expect(result.wearChanged).toBe(true);
      expect(result.previousWearPercentage).toBe(10);
      expect(mockPartWearRepository.findById).toHaveBeenCalledWith(partWearId);
      expect(mockMotorcyclePartRepository.findById).toHaveBeenCalled();
      expect(mockPartWearRepository.save).toHaveBeenCalled();
    });

    it('should throw error if part wear not found', async () => {
      const partWearId = new IdVO().getValue();

      mockPartWearRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute(partWearId, 15000)).rejects.toThrow(
        PartWearNotFoundException,
      );
    });

    it('should throw error for negative odometer', async () => {
      const partWearId = new IdVO().getValue();

      await expect(useCase.execute(partWearId, -100)).rejects.toThrow(
        InvalidWearCalculationException,
      );
    });

    it('should throw error if motorcycle part not found', async () => {
      const partWearId = new IdVO().getValue();
      const motorcyclePartId = new IdVO();

      const partWear = PartWear.create({
        motorcyclePartId,
        currentWearPercentage: WearPercentage.zero(),
        lastCalculatedAt: new Date(),
        lastKnownOdometer: new Odometer(10000),
        projectedReplacementOdometer: 20000,
        isMaintenanceDue: false,
      });

      mockPartWearRepository.findById.mockResolvedValue(partWear);
      mockMotorcyclePartRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute(partWearId, 15000)).rejects.toThrow(
        InvalidWearCalculationException,
      );
    });

    it('should throw error if motorcycle part is inactive', async () => {
      const partWearId = new IdVO().getValue();
      const motorcyclePartId = new IdVO();

      const inactivePart = MotorcyclePart.reconstitute(
        motorcyclePartId.getValue(),
        new IdVO().getValue(),
        PartType.CHAIN,
        PartCategory.DRIVETRAIN,
        'Old Chain',
        undefined,
        undefined,
        new Date('2024-01-01'),
        10000,
        5000,
        undefined,
        undefined,
        70,
        undefined,
        false,
        new Date(),
        new Date(),
      );

      const partWear = PartWear.create({
        motorcyclePartId,
        currentWearPercentage: WearPercentage.zero(),
        lastCalculatedAt: new Date(),
        lastKnownOdometer: new Odometer(10000),
        projectedReplacementOdometer: 20000,
        isMaintenanceDue: false,
      });

      mockPartWearRepository.findById.mockResolvedValue(partWear);
      mockMotorcyclePartRepository.findById.mockResolvedValue(inactivePart);

      await expect(useCase.execute(partWearId, 15000)).rejects.toThrow(
        InvalidWearCalculationException,
      );
    });

    it('should detect when wear percentage changes', async () => {
      const partWearId = new IdVO().getValue();
      const motorcyclePartId = new IdVO();

      const motorcyclePart = MotorcyclePart.create({
        userMotocycleId: new IdVO().getValue(),
        partType: PartType.FRONT_TIRE,
        partCategory: PartCategory.TIRES,
        name: 'Tire',
        installationDate: new Date('2024-01-01'),
        installationOdometer: 10000,
        expectedLifespanKm: 10000,
        replacementThreshold: 70,
      });

      const partWear = PartWear.create({
        motorcyclePartId,
        currentWearPercentage: WearPercentage.create(50),
        lastCalculatedAt: new Date(),
        lastKnownOdometer: new Odometer(15000),
        projectedReplacementOdometer: 20000,
        isMaintenanceDue: false,
      });

      mockPartWearRepository.findById.mockResolvedValue(partWear);
      mockMotorcyclePartRepository.findById.mockResolvedValue(motorcyclePart);
      mockPartWearRepository.save.mockResolvedValue(partWear);

      const result = await useCase.execute(partWearId, 18000);

      expect(result.wearChanged).toBe(true);
    });

    it('should detect when wear percentage does not change', async () => {
      const partWearId = new IdVO().getValue();
      const motorcyclePartId = new IdVO();

      const motorcyclePart = MotorcyclePart.create({
        userMotocycleId: new IdVO().getValue(),
        partType: PartType.FRONT_TIRE,
        partCategory: PartCategory.TIRES,
        name: 'Tire',
        installationDate: new Date('2024-01-01'),
        installationOdometer: 10000,
        expectedLifespanKm: 10000,
        replacementThreshold: 70,
      });

      const partWear = PartWear.create({
        motorcyclePartId,
        currentWearPercentage: WearPercentage.create(50),
        lastCalculatedAt: new Date(),
        lastKnownOdometer: new Odometer(15000),
        projectedReplacementOdometer: 20000,
        isMaintenanceDue: false,
      });

      mockPartWearRepository.findById.mockResolvedValue(partWear);
      mockMotorcyclePartRepository.findById.mockResolvedValue(motorcyclePart);
      mockPartWearRepository.save.mockResolvedValue(partWear);

      const result = await useCase.execute(partWearId, 15000);

      expect(result.wearChanged).toBe(false);
    });

    it('should calculate maintenance due status correctly', async () => {
      const partWearId = new IdVO().getValue();
      const motorcyclePartId = new IdVO();

      const motorcyclePart = MotorcyclePart.create({
        userMotocycleId: new IdVO().getValue(),
        partType: PartType.FRONT_TIRE,
        partCategory: PartCategory.TIRES,
        name: 'Tire',
        installationDate: new Date('2024-01-01'),
        installationOdometer: 10000,
        expectedLifespanKm: 10000,
        replacementThreshold: 70,
      });

      const partWear = PartWear.create({
        motorcyclePartId,
        currentWearPercentage: WearPercentage.create(50),
        lastCalculatedAt: new Date(),
        lastKnownOdometer: new Odometer(15000),
        projectedReplacementOdometer: 20000,
        isMaintenanceDue: false,
      });

      mockPartWearRepository.findById.mockResolvedValue(partWear);
      mockMotorcyclePartRepository.findById.mockResolvedValue(motorcyclePart);
      mockPartWearRepository.save.mockResolvedValue(partWear);

      const result = await useCase.execute(partWearId, 17000);

      expect(result.currentWearPercentage).toBe(70);
    });
  });
});
