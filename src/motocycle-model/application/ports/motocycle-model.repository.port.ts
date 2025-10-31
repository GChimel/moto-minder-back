import { MotocycleModel } from '../../domain/entities/motocycle-model.entity';

export interface MotocycleModelRepositoryPort {
  save(motocycleModel: MotocycleModel): Promise<MotocycleModel>;
  findAll(): Promise<MotocycleModel[]>;
  findById(id: string): Promise<MotocycleModel | null>;
  findByManufacturerId(manufacturerId: string): Promise<MotocycleModel[]>;
  findByNameAndManufacturer(
    name: string,
    manufacturerId: string,
  ): Promise<MotocycleModel | null>;
  delete(id: string): Promise<void>;
}

export const MOTOCYCLE_MODEL_REPOSITORY = Symbol('MOTOCYCLE_MODEL_REPOSITORY');
