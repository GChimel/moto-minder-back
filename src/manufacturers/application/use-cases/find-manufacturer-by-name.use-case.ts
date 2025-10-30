import { Inject, Injectable } from '@nestjs/common';
import {
  MANUFACTURER_REPOSITORY,
  ManufacturerRepositoryPort,
} from '../ports/manufacturer.repository.port';
import { Manufacturer } from '../../domain/entities/manufacturer.entity';
import { ManufacturerNotFoundException } from '../../domain/exceptions/manufacturer-not-found.exception';

@Injectable()
export class FindManufacturerByNameUseCase {
  constructor(
    @Inject(MANUFACTURER_REPOSITORY)
    private readonly manufacturerRepository: ManufacturerRepositoryPort,
  ) {}

  async execute(name: string): Promise<Manufacturer> {
    const manufacturer = await this.manufacturerRepository.findByName(name);

    if (!manufacturer) {
      throw new ManufacturerNotFoundException(name);
    }

    return manufacturer;
  }
}
