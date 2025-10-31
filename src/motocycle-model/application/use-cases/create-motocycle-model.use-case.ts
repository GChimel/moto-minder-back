import { Inject, Injectable } from '@nestjs/common';
import {
  MOTOCYCLE_MODEL_REPOSITORY,
  MotocycleModelRepositoryPort,
} from '../ports/motocycle-model.repository.port';
import { MotocycleModel } from '../../domain/entities/motocycle-model.entity';
import { MotocycleModelAlreadyExistsException } from '../../domain/exceptions/motocycle-model-already-exists.exception';

export interface CreateMotocycleModelCommand {
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

@Injectable()
export class CreateMotocycleModelUseCase {
  constructor(
    @Inject(MOTOCYCLE_MODEL_REPOSITORY)
    private readonly repository: MotocycleModelRepositoryPort,
  ) {}

  async execute(command: CreateMotocycleModelCommand): Promise<MotocycleModel> {
    const existing = await this.repository.findByNameAndManufacturer(
      command.name,
      command.manufacturerId,
    );

    if (existing) {
      throw new MotocycleModelAlreadyExistsException(
        command.name,
        command.manufacturerId,
      );
    }

    const motocycleModel = MotocycleModel.create(command);
    return this.repository.save(motocycleModel);
  }
}
