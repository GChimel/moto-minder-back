import { Manufacturer } from '../../domain/entities/manufacturer.entity';

export interface ManufacturerRepositoryPort {
  save(manufacturer: Manufacturer): Promise<Manufacturer>;
  findAll(): Promise<Manufacturer[]>;
  findById(id: string): Promise<Manufacturer | null>;
  findByName(name: string): Promise<Manufacturer | null>;
  delete(id: string): Promise<void>;
}

export const MANUFACTURER_REPOSITORY = Symbol('MANUFACTURER_REPOSITORY');
