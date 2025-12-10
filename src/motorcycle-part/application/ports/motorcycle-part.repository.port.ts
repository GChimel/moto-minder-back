import { MotorcyclePart } from '../../domain/entities/motorcycle-part.entity';
import { PartType } from '../../domain/enums/part-type.enum';

export const MOTORCYCLE_PART_REPOSITORY = 'MOTORCYCLE_PART_REPOSITORY';

export interface MotorcyclePartRepositoryPort {
  save(part: MotorcyclePart): Promise<MotorcyclePart>;
  findById(id: string): Promise<MotorcyclePart | null>;
  findByUserMotocycleId(userMotocycleId: string): Promise<MotorcyclePart[]>;
  findActiveByUserMotocycleId(
    userMotocycleId: string,
  ): Promise<MotorcyclePart[]>;
  findByPartType(
    userMotocycleId: string,
    partType: PartType,
  ): Promise<MotorcyclePart[]>;
  delete(id: string): Promise<void>;
}
