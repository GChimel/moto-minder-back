import { Inject, Injectable } from '@nestjs/common';
import {
  MANUFACTURER_REPOSITORY,
  ManufacturerRepositoryPort,
} from '../ports/manufacturer.repository.port';
import { Manufacturer } from '../../domain/entities/manufacturer.entity';
import { ManufacturerAlreadyExistsException } from '../../domain/exceptions/manufacturer-already-exists.exception';

export interface CreateManufacturerDto {
  name: string;
}

@Injectable()
export class CreateManufacturerUseCase {
  constructor(
    @Inject(MANUFACTURER_REPOSITORY)
    private readonly manufacturerRepository: ManufacturerRepositoryPort,
  ) {}

  async execute(dto: CreateManufacturerDto): Promise<Manufacturer> {
    const existingManufacturer = await this.manufacturerRepository.findByName(
      dto.name,
    );

    if (existingManufacturer) {
      throw new ManufacturerAlreadyExistsException(dto.name);
    }

    const manufacturer = Manufacturer.create(dto.name);
    return this.manufacturerRepository.save(manufacturer);
  }
}
