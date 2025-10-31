import { Inject, Injectable } from '@nestjs/common';
import {
  MOTOCYCLE_MODEL_REPOSITORY,
  MotocycleModelRepositoryPort,
} from '../ports/motocycle-model.repository.port';
import { MotocycleModel } from '../../domain/entities/motocycle-model.entity';
import { MotocycleModelNotFoundException } from '../../domain/exceptions/motocycle-model-not-found.exception';

export interface UpdateMotocycleModelCommand {
  name?: string;
  yearStart?: number;
  yearEnd?: number;
  displacementCc?: number;
  engineCycle?: string;
  engineType?: string;
  valvesPerCylinder?: number;
  coolingSystem?: string;
  fuelSystem?: string;
  sparkPlugDefault?: string;
  batteryDefault?: string;
  finalDrive?: string;
  gears?: number;
  clutchType?: string;
  engineOilCapacityL?: number;
  recommendedOilViscosity?: string;
  recommendedOilSpec?: string;
  fuelTankCapacityL?: number;
  coolantCapacityL?: number | null;
}

@Injectable()
export class UpdateMotocycleModelUseCase {
  constructor(
    @Inject(MOTOCYCLE_MODEL_REPOSITORY)
    private readonly repository: MotocycleModelRepositoryPort,
  ) {}

  async execute(
    id: string,
    command: UpdateMotocycleModelCommand,
  ): Promise<MotocycleModel> {
    const motocycleModel = await this.repository.findById(id);

    if (!motocycleModel) {
      throw new MotocycleModelNotFoundException(id);
    }

    if (command.name !== undefined) {
      motocycleModel.updateName(command.name);
    }

    if (command.yearStart !== undefined || command.yearEnd !== undefined) {
      motocycleModel.updateYears(
        command.yearStart ?? motocycleModel.getYearStart(),
        command.yearEnd ?? motocycleModel.getYearEnd(),
      );
    }

    if (command.displacementCc !== undefined) {
      motocycleModel.updateDisplacement(command.displacementCc);
    }

    if (command.engineCycle !== undefined) {
      motocycleModel.updateEngineCycle(command.engineCycle);
    }

    if (command.engineType !== undefined) {
      motocycleModel.updateEngineType(command.engineType);
    }

    if (command.valvesPerCylinder !== undefined) {
      motocycleModel.updateValvesPerCylinder(command.valvesPerCylinder);
    }

    if (command.coolingSystem !== undefined) {
      motocycleModel.updateCoolingSystem(command.coolingSystem);
    }

    if (command.fuelSystem !== undefined) {
      motocycleModel.updateFuelSystem(command.fuelSystem);
    }

    if (command.sparkPlugDefault !== undefined) {
      motocycleModel.updateSparkPlugDefault(command.sparkPlugDefault);
    }

    if (command.batteryDefault !== undefined) {
      motocycleModel.updateBatteryDefault(command.batteryDefault);
    }

    if (command.finalDrive !== undefined) {
      motocycleModel.updateFinalDrive(command.finalDrive);
    }

    if (command.gears !== undefined) {
      motocycleModel.updateGears(command.gears);
    }

    if (command.clutchType !== undefined) {
      motocycleModel.updateClutchType(command.clutchType);
    }

    if (command.engineOilCapacityL !== undefined) {
      motocycleModel.updateEngineOilCapacity(command.engineOilCapacityL);
    }

    if (command.recommendedOilViscosity !== undefined) {
      motocycleModel.updateRecommendedOilViscosity(
        command.recommendedOilViscosity,
      );
    }

    if (command.recommendedOilSpec !== undefined) {
      motocycleModel.updateRecommendedOilSpec(command.recommendedOilSpec);
    }

    if (command.fuelTankCapacityL !== undefined) {
      motocycleModel.updateFuelTankCapacity(command.fuelTankCapacityL);
    }

    if (command.coolantCapacityL !== undefined) {
      motocycleModel.updateCoolantCapacity(command.coolantCapacityL);
    }

    return this.repository.save(motocycleModel);
  }
}
