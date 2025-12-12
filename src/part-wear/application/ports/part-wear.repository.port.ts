import { PartWear } from '../../domain/entities/part-wear.entity';

export const PART_WEAR_REPOSITORY = 'PART_WEAR_REPOSITORY';

export interface PartWearRepositoryPort {
  save(partWear: PartWear): Promise<PartWear>;

  findById(id: string): Promise<PartWear | null>;

  findByMotorcyclePartId(motorcyclePartId: string): Promise<PartWear | null>;

  findByUserMotocycleId(userMotocycleId: string): Promise<PartWear[]>;

  findPartsDueForMaintenance(userMotocycleId: string): Promise<PartWear[]>;

  delete(id: string): Promise<void>;
}
