import { Inject, Injectable } from '@nestjs/common';
import {
  MANUFACTURER_REPOSITORY,
  ManufacturerRepositoryPort,
} from '../ports/manufacturer.repository.port';
import { Manufacturer } from '../../domain/entities/manufacturer.entity';
import { ManufacturerNotFoundException } from '../../domain/exceptions/manufacturer-not-found.exception';

@Injectable()
export class FindManufacturerByIdUseCase {
  constructor(
    @Inject(MANUFACTURER_REPOSITORY)
    private readonly manufacturerRepository: ManufacturerRepositoryPort,
  ) {}

  async execute(id: string): Promise<Manufacturer> {
    const manufacturer = await this.manufacturerRepository.findById(id);

    if (!manufacturer) {
      throw new ManufacturerNotFoundException(id);
    }

    return manufacturer;
  }
}
