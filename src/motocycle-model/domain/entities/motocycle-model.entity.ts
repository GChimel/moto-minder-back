import { ManufacturerId } from '../../../manufacturers/domain/value-objects/manufacturer-id.vo';
import { MotocycleCoolingSystem } from '../value-objects/motocycle-model-cooling-system.vo';
import { MotocycleEngineCycle } from '../value-objects/motocycle-model-engine-cycle.vo';
import { MotocycleModelId } from '../value-objects/motocycle-model-id.vo';
import { MotocycleModelName } from '../value-objects/motocycle-model-name.vo';

interface IMotocycleModel {
  manufacturerId: string;
  name: string;
  yearStart: number;
  yearEnd: number;
  displacementCc: number;
  engineCycle: string;
  engineType: string;
  valvesPerCylinder: number;
  coolingSystem: string;
  fuelSystem: string;
  sparkPlugDefault: string;
  batteryDefault: string;
  finalDrive: string;
  gears: number;
  clutchType: string;
  engineOilCapacityL: number;
  recommendedOilViscosity: string;
  recommendedOilSpec: string;
  fuelTankCapacityL: number;
  coolantCapacityL?: number | null;
}

export class MotocycleModel {
  constructor(
    private readonly id: MotocycleModelId,
    private readonly manufacturerId: ManufacturerId,
    private name: MotocycleModelName,
    private yearStart: number,
    private yearEnd: number,
    private displacementCc: number,
    private engineCycle: MotocycleEngineCycle,
    private engineType: string,
    private valvesPerCylinder: number,
    private coolingSystem: MotocycleCoolingSystem,
    private fuelSystem: string,
    private sparkPlugDefault: string,
    private batteryDefault: string,
    private finalDrive: string,
    private gears: number,
    private clutchType: string,
    private engineOilCapacityL: number,
    private recommendedOilViscosity: string,
    private recommendedOilSpec: string,
    private fuelTankCapacityL: number,
    private coolantCapacityL?: number | null,
  ) {}

  static create(body: IMotocycleModel): MotocycleModel {
    return new MotocycleModel(
      new MotocycleModelId(),
      new ManufacturerId(body.manufacturerId),
      new MotocycleModelName(body.name),
      body.yearStart,
      body.yearEnd,
      body.displacementCc,
      new MotocycleEngineCycle(body.engineCycle),
      body.engineType,
      body.valvesPerCylinder,
      new MotocycleCoolingSystem(body.coolingSystem),
      body.fuelSystem,
      body.sparkPlugDefault,
      body.batteryDefault,
      body.finalDrive,
      body.gears,
      body.clutchType,
      body.engineOilCapacityL,
      body.recommendedOilViscosity,
      body.recommendedOilSpec,
      body.fuelTankCapacityL,
      body.coolantCapacityL,
    );
  }

  static reconstitute(
    id: string,
    manufacturerId: string,
    name: string,
    yearStart: number,
    yearEnd: number,
    displacementCc: number,
    engineCycle: string,
    engineType: string,
    valvesPerCylinder: number,
    coolingSystem: string,
    fuelSystem: string,
    sparkPlugDefault: string,
    batteryDefault: string,
    finalDrive: string,
    gears: number,
    clutchType: string,
    engineOilCapacityL: number,
    recommendedOilViscosity: string,
    recommendedOilSpec: string,
    fuelTankCapacityL: number,
    coolantCapacityL?: number | null,
  ): MotocycleModel {
    return new MotocycleModel(
      new MotocycleModelId(id),
      new ManufacturerId(manufacturerId),
      new MotocycleModelName(name),
      yearStart,
      yearEnd,
      displacementCc,
      new MotocycleEngineCycle(engineCycle),
      engineType,
      valvesPerCylinder,
      new MotocycleCoolingSystem(coolingSystem),
      fuelSystem,
      sparkPlugDefault,
      batteryDefault,
      finalDrive,
      gears,
      clutchType,
      engineOilCapacityL,
      recommendedOilViscosity,
      recommendedOilSpec,
      fuelTankCapacityL,
      coolantCapacityL,
    );
  }

  // Getters
  getId(): MotocycleModelId {
    return this.id;
  }

  getManufacturerId(): ManufacturerId {
    return this.manufacturerId;
  }

  getName(): MotocycleModelName {
    return this.name;
  }

  getYearStart(): number {
    return this.yearStart;
  }

  getYearEnd(): number {
    return this.yearEnd;
  }

  getDisplacementCc(): number {
    return this.displacementCc;
  }

  getEngineCycle(): MotocycleEngineCycle {
    return this.engineCycle;
  }

  getEngineType(): string {
    return this.engineType;
  }

  getValvesPerCylinder(): number {
    return this.valvesPerCylinder;
  }

  getCoolingSystem(): MotocycleCoolingSystem {
    return this.coolingSystem;
  }

  getFuelSystem(): string {
    return this.fuelSystem;
  }

  getSparkPlugDefault(): string {
    return this.sparkPlugDefault;
  }

  getBatteryDefault(): string {
    return this.batteryDefault;
  }

  getFinalDrive(): string {
    return this.finalDrive;
  }

  getGears(): number {
    return this.gears;
  }

  getClutchType(): string {
    return this.clutchType;
  }

  getEngineOilCapacityL(): number {
    return this.engineOilCapacityL;
  }

  getRecommendedOilViscosity(): string {
    return this.recommendedOilViscosity;
  }

  getRecommendedOilSpec(): string {
    return this.recommendedOilSpec;
  }

  getFuelTankCapacityL(): number {
    return this.fuelTankCapacityL;
  }

  getCoolantCapacityL(): number | null | undefined {
    return this.coolantCapacityL;
  }

  // Update methods
  updateName(name: string): void {
    this.name = new MotocycleModelName(name);
  }

  updateYears(yearStart: number, yearEnd: number): void {
    this.yearStart = yearStart;
    this.yearEnd = yearEnd;
  }

  updateDisplacement(displacementCc: number): void {
    this.displacementCc = displacementCc;
  }

  updateEngineCycle(engineCycle: string): void {
    this.engineCycle = new MotocycleEngineCycle(engineCycle);
  }

  updateEngineType(engineType: string): void {
    this.engineType = engineType;
  }

  updateValvesPerCylinder(valvesPerCylinder: number): void {
    this.valvesPerCylinder = valvesPerCylinder;
  }

  updateCoolingSystem(coolingSystem: string): void {
    this.coolingSystem = new MotocycleCoolingSystem(coolingSystem);
  }

  updateFuelSystem(fuelSystem: string): void {
    this.fuelSystem = fuelSystem;
  }

  updateSparkPlugDefault(sparkPlugDefault: string): void {
    this.sparkPlugDefault = sparkPlugDefault;
  }

  updateBatteryDefault(batteryDefault: string): void {
    this.batteryDefault = batteryDefault;
  }

  updateFinalDrive(finalDrive: string): void {
    this.finalDrive = finalDrive;
  }

  updateGears(gears: number): void {
    this.gears = gears;
  }

  updateClutchType(clutchType: string): void {
    this.clutchType = clutchType;
  }

  updateEngineOilCapacity(engineOilCapacityL: number): void {
    this.engineOilCapacityL = engineOilCapacityL;
  }

  updateRecommendedOilViscosity(recommendedOilViscosity: string): void {
    this.recommendedOilViscosity = recommendedOilViscosity;
  }

  updateRecommendedOilSpec(recommendedOilSpec: string): void {
    this.recommendedOilSpec = recommendedOilSpec;
  }

  updateFuelTankCapacity(fuelTankCapacityL: number): void {
    this.fuelTankCapacityL = fuelTankCapacityL;
  }

  updateCoolantCapacity(coolantCapacityL: number | null): void {
    this.coolantCapacityL = coolantCapacityL;
  }
}
