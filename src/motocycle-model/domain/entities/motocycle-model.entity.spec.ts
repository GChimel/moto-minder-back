import { MotocycleModel } from './motocycle-model.entity';

describe('MotocycleModel Entity', () => {
  const validInput = {
    manufacturerId: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Harley-Davidson Street 750',
    yearStart: 2014,
    yearEnd: 2024,
    displacementCc: 750,
    engineCycle: '4-STROKE',
    engineType: 'V-Twin',
    valvesPerCylinder: 2,
    coolingSystem: 'AIR',
    fuelSystem: 'Fuel Injection',
    sparkPlugDefault: 'NGK D8EA',
    batteryDefault: '12V 19Ah',
    finalDrive: 'Belt',
    gears: 5,
    clutchType: 'Wet Single-Plate',
    engineOilCapacityL: 3.8,
    recommendedOilViscosity: '20W-40',
    recommendedOilSpec: 'Mineral or Synthetic Blend',
    fuelTankCapacityL: 13.5,
    coolantCapacityL: null,
  };

  describe('create', () => {
    it('should create a valid MotocycleModel entity', () => {
      const model = MotocycleModel.create(validInput);

      expect(model.getId()).toBeDefined();
      expect(model.getManufacturerId().getValue()).toBe(
        validInput.manufacturerId,
      );
      expect(model.getName().getValue()).toBe(validInput.name);
      expect(model.getYearStart()).toBe(validInput.yearStart);
      expect(model.getYearEnd()).toBe(validInput.yearEnd);
      expect(model.getDisplacementCc()).toBe(validInput.displacementCc);
    });

    it('should handle all 20 technical specifications', () => {
      const model = MotocycleModel.create(validInput);

      expect(model.getEngineType()).toBe(validInput.engineType);
      expect(model.getValvesPerCylinder()).toBe(validInput.valvesPerCylinder);
      expect(model.getFuelSystem()).toBe(validInput.fuelSystem);
      expect(model.getSparkPlugDefault()).toBe(validInput.sparkPlugDefault);
      expect(model.getBatteryDefault()).toBe(validInput.batteryDefault);
      expect(model.getFinalDrive()).toBe(validInput.finalDrive);
      expect(model.getGears()).toBe(validInput.gears);
      expect(model.getClutchType()).toBe(validInput.clutchType);
      expect(model.getEngineOilCapacityL()).toBe(validInput.engineOilCapacityL);
      expect(model.getRecommendedOilViscosity()).toBe(
        validInput.recommendedOilViscosity,
      );
      expect(model.getRecommendedOilSpec()).toBe(validInput.recommendedOilSpec);
      expect(model.getFuelTankCapacityL()).toBe(validInput.fuelTankCapacityL);
    });

    it('should accept optional coolant capacity', () => {
      const modelWithCoolant = MotocycleModel.create({
        ...validInput,
        coolantCapacityL: 3.0,
      });

      expect(modelWithCoolant.getCoolantCapacityL()).toBe(3.0);
    });

    it('should validate engine cycle enum', () => {
      expect(() =>
        MotocycleModel.create({
          ...validInput,
          engineCycle: 'INVALID_CYCLE',
        }),
      ).toThrow();
    });

    it('should validate cooling system enum', () => {
      expect(() =>
        MotocycleModel.create({
          ...validInput,
          coolingSystem: 'INVALID_COOLING',
        }),
      ).toThrow();
    });
  });

  describe('reconstitute', () => {
    it('should reconstitute from database values', () => {
      const id = '660e8400-e29b-41d4-a716-446655440001';
      const model = MotocycleModel.reconstitute(
        id,
        validInput.manufacturerId,
        validInput.name,
        validInput.yearStart,
        validInput.yearEnd,
        validInput.displacementCc,
        validInput.engineCycle,
        validInput.engineType,
        validInput.valvesPerCylinder,
        validInput.coolingSystem,
        validInput.fuelSystem,
        validInput.sparkPlugDefault,
        validInput.batteryDefault,
        validInput.finalDrive,
        validInput.gears,
        validInput.clutchType,
        validInput.engineOilCapacityL,
        validInput.recommendedOilViscosity,
        validInput.recommendedOilSpec,
        validInput.fuelTankCapacityL,
        validInput.coolantCapacityL,
      );

      expect(model.getId().getValue()).toBe(id);
      expect(model.getManufacturerId().getValue()).toBe(
        validInput.manufacturerId,
      );
      expect(model.getName().getValue()).toBe(validInput.name);
    });
  });

  describe('update methods', () => {
    it('should update name', () => {
      const model = MotocycleModel.create(validInput);
      model.updateName('New Model Name');

      expect(model.getName().getValue()).toBe('New Model Name');
    });

    it('should update year range', () => {
      const model = MotocycleModel.create(validInput);
      model.updateYears(2015, 2025);

      expect(model.getYearStart()).toBe(2015);
      expect(model.getYearEnd()).toBe(2025);
    });

    it('should update displacement', () => {
      const model = MotocycleModel.create(validInput);
      model.updateDisplacement(883);

      expect(model.getDisplacementCc()).toBe(883);
    });

    it('should update engine cycle', () => {
      const model = MotocycleModel.create(validInput);
      model.updateEngineCycle('2-STROKE');

      expect(model.getEngineCycle().getValue()).toBe('2-STROKE');
    });

    it('should update engine type', () => {
      const model = MotocycleModel.create(validInput);
      model.updateEngineType('Inline 4');

      expect(model.getEngineType()).toBe('Inline 4');
    });

    it('should update valves per cylinder', () => {
      const model = MotocycleModel.create(validInput);
      model.updateValvesPerCylinder(4);

      expect(model.getValvesPerCylinder()).toBe(4);
    });

    it('should update cooling system', () => {
      const model = MotocycleModel.create(validInput);
      model.updateCoolingSystem('LIQUID');

      expect(model.getCoolingSystem().getValue()).toBe('LIQUID');
    });

    it('should update fuel system', () => {
      const model = MotocycleModel.create(validInput);
      model.updateFuelSystem('Carburetors');

      expect(model.getFuelSystem()).toBe('Carburetors');
    });

    it('should update spark plug default', () => {
      const model = MotocycleModel.create(validInput);
      model.updateSparkPlugDefault('NGK D9EA');

      expect(model.getSparkPlugDefault()).toBe('NGK D9EA');
    });

    it('should update battery default', () => {
      const model = MotocycleModel.create(validInput);
      model.updateBatteryDefault('12V 20Ah');

      expect(model.getBatteryDefault()).toBe('12V 20Ah');
    });

    it('should update final drive', () => {
      const model = MotocycleModel.create(validInput);
      model.updateFinalDrive('Chain');

      expect(model.getFinalDrive()).toBe('Chain');
    });

    it('should update gears', () => {
      const model = MotocycleModel.create(validInput);
      model.updateGears(6);

      expect(model.getGears()).toBe(6);
    });

    it('should update clutch type', () => {
      const model = MotocycleModel.create(validInput);
      model.updateClutchType('Dry Multi-Plate');

      expect(model.getClutchType()).toBe('Dry Multi-Plate');
    });

    it('should update engine oil capacity', () => {
      const model = MotocycleModel.create(validInput);
      model.updateEngineOilCapacity(4.0);

      expect(model.getEngineOilCapacityL()).toBe(4.0);
    });

    it('should update recommended oil viscosity', () => {
      const model = MotocycleModel.create(validInput);
      model.updateRecommendedOilViscosity('15W-40');

      expect(model.getRecommendedOilViscosity()).toBe('15W-40');
    });

    it('should update recommended oil spec', () => {
      const model = MotocycleModel.create(validInput);
      model.updateRecommendedOilSpec('Synthetic');

      expect(model.getRecommendedOilSpec()).toBe('Synthetic');
    });

    it('should update fuel tank capacity', () => {
      const model = MotocycleModel.create(validInput);
      model.updateFuelTankCapacity(15.0);

      expect(model.getFuelTankCapacityL()).toBe(15.0);
    });

    it('should update coolant capacity', () => {
      const model = MotocycleModel.create(validInput);
      model.updateCoolantCapacity(3.5);

      expect(model.getCoolantCapacityL()).toBe(3.5);
    });
  });

  describe('getters', () => {
    it('should return all properties via getters', () => {
      const model = MotocycleModel.create(validInput);

      expect(model.getId()).toBeDefined();
      expect(model.getManufacturerId()).toBeDefined();
      expect(model.getName()).toBeDefined();
      expect(model.getYearStart()).toBeDefined();
      expect(model.getYearEnd()).toBeDefined();
      expect(model.getDisplacementCc()).toBeDefined();
      expect(model.getEngineCycle()).toBeDefined();
      expect(model.getEngineType()).toBeDefined();
      expect(model.getValvesPerCylinder()).toBeDefined();
      expect(model.getCoolingSystem()).toBeDefined();
      expect(model.getFuelSystem()).toBeDefined();
      expect(model.getSparkPlugDefault()).toBeDefined();
      expect(model.getBatteryDefault()).toBeDefined();
      expect(model.getFinalDrive()).toBeDefined();
      expect(model.getGears()).toBeDefined();
      expect(model.getClutchType()).toBeDefined();
      expect(model.getEngineOilCapacityL()).toBeDefined();
      expect(model.getRecommendedOilViscosity()).toBeDefined();
      expect(model.getRecommendedOilSpec()).toBeDefined();
      expect(model.getFuelTankCapacityL()).toBeDefined();
      expect(model.getCoolantCapacityL()).toBeDefined();
    });
  });

  describe('engine cycle variations', () => {
    it('should support 2-STROKE engine cycle', () => {
      const twoStrokeModel = MotocycleModel.create({
        ...validInput,
        engineCycle: '2-STROKE',
      });

      expect(twoStrokeModel.getEngineCycle().getValue()).toBe('2-STROKE');
    });

    it('should support 4-STROKE engine cycle', () => {
      const fourStrokeModel = MotocycleModel.create({
        ...validInput,
        engineCycle: '4-STROKE',
      });

      expect(fourStrokeModel.getEngineCycle().getValue()).toBe('4-STROKE');
    });
  });

  describe('cooling system variations', () => {
    it('should support AIR cooling', () => {
      const airCooledModel = MotocycleModel.create({
        ...validInput,
        coolingSystem: 'AIR',
      });

      expect(airCooledModel.getCoolingSystem().getValue()).toBe('AIR');
    });

    it('should support LIQUID cooling', () => {
      const liquidCooledModel = MotocycleModel.create({
        ...validInput,
        coolingSystem: 'LIQUID',
      });

      expect(liquidCooledModel.getCoolingSystem().getValue()).toBe('LIQUID');
    });

    it('should support LIQUID_AND_AIR cooling', () => {
      const hybridModel = MotocycleModel.create({
        ...validInput,
        coolingSystem: 'LIQUID_AND_AIR',
      });

      expect(hybridModel.getCoolingSystem().getValue()).toBe('LIQUID_AND_AIR');
    });
  });
});
